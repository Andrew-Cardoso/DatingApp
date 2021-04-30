using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
	public class MessageHub : Hub
	{

		private readonly IMapper _mapper;

		private readonly IHubContext<PresenceHub> _presenceHub;

		private readonly PresenceTracker _tracker;
		private readonly IUnitOfWork _unitOfWork;

		public MessageHub(IMapper mapper, IHubContext<PresenceHub> presenceHub, PresenceTracker tracker, IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_tracker = tracker;
			_presenceHub = presenceHub;
			_mapper = mapper;
		}

		public override async Task OnConnectedAsync()
		{
			var httpContext = Context.GetHttpContext();
			var otherUser = httpContext.Request.Query["user"].ToString();
			var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
			await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

			var group = await AddToGroup(groupName);

			await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

			var messages = await _unitOfWork.MessageRepository.GetMessageThread(Context.User.GetUsername(), otherUser);

			if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

			await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
		}

		public override async Task OnDisconnectedAsync(Exception exception)
		{
			var group = await RemoveFromMessageGroup();
			await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
			await base.OnDisconnectedAsync(exception);
		}

		public async Task SendMessage(CreateMessageDto createMessageDto)
		{
			string username = Context.User.GetUsername();
			if (username == createMessageDto.ReceiverUsername.ToLower())
				throw new HubException("You cannot send messages to yourself");

			var sender = await _unitOfWork.UserRepository.GetUserAsync(username);
			var receiver =
				await _unitOfWork.UserRepository
					.GetUserAsync(createMessageDto.ReceiverUsername);

			if (receiver == null) throw new HubException("User Not Found");

			var message =
				new Message
				{
					Sender = sender,
					Receiver = receiver,
					SenderUsername = sender.UserName,
					ReceiverUsername = receiver.UserName,
					Content = createMessageDto.Content
				};

			var groupName = GetGroupName(sender.UserName, receiver.UserName);
			var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);

			if (group.Connections.Any(x => x.Username == receiver.UserName))
			{
				message.DateRead = DateTime.UtcNow;
			}
			else
			{
				var connections = await _tracker.GetConnectionsForUser(receiver.UserName);
				if (connections != null)
				{
					string messagePreview = message.Content.Length < 21 ? message.Content : $"{message.Content.Substring(0, 21).Trim()}...";
					await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", new { username = sender.UserName, knownAs = sender.KnownAs, messagePreview = messagePreview });
				}
			}

			_unitOfWork.MessageRepository.AddMessage(message);

			if (await _unitOfWork.Complete())
				await Clients
					.Group(groupName)
					.SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
		}

		private async Task<Group> AddToGroup(string groupName)
		{
			var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
			var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

			if (group == null)
			{
				group = new Group(groupName);
				group.Connections = new List<Connection>();
				_unitOfWork.MessageRepository.AddGroup(group);
			}
			group.Connections.Add(connection);
			if (await _unitOfWork.Complete()) return group;

			throw new HubException("Failed to connect chat");
		}

		private async Task<Group> RemoveFromMessageGroup()
		{
			var group = await _unitOfWork.MessageRepository.GetGroup(Context.ConnectionId);
			var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
			_unitOfWork.MessageRepository.RemoveConnection(connection);
			if (await _unitOfWork.Complete()) return group;

			throw new HubException("Something wrong is going on");
		}

		private string GetGroupName(string caller, string other)
		{
			var stringCompare = string.CompareOrdinal(caller, other) < 0;
			return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
		}
	}
}
