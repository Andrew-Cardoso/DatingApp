using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
	public class MessageRepository : IMessageRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		public MessageRepository(DataContext context, IMapper mapper)
		{
			_mapper = mapper;
			_context = context;
		}

		public void AddGroup(Group group)
		{
			_context.Groups.Add(group);
		}

		public void AddMessage(Message message)
		{
			_context.Messages.Add(message);
		}

		public void DeleteMessage(Message message)
		{
			_context.Messages.Remove(message);
		}

		public async Task<Connection> GetConnection(string connectionId)
		{
			return await _context.Connections.FindAsync(connectionId);
		}

		public async Task<Group> GetGroup(string connectionId)
		{
			return await _context.Groups.Include(x => x.Connections).Where(x => x.Connections.Any(x => x.ConnectionId == connectionId)).FirstOrDefaultAsync();
		}

		public async Task<Message> GetMessage(int id)
		{
			return await _context.Messages.Include(x => x.Sender).Include(x => x.Receiver).SingleOrDefaultAsync(x => x.Id == id);
		}

		public async Task<Group> GetMessageGroup(string groupName)
		{
			return await _context.Groups.Include(x => x.Connections).FirstOrDefaultAsync(x => x.Name == groupName);
		}

		public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
		{
			var messages = _context.Messages.OrderByDescending(x => x.MessageSent).ProjectTo<MessageDto>(_mapper.ConfigurationProvider).AsQueryable();

			messages = messageParams.Container switch
			{
				"inbox" => messages.Where(x => x.ReceiverUsername == messageParams.Username && !x.ReceiverDeleted),
				"outbox" => messages.Where(x => x.SenderUsername == messageParams.Username && !x.SenderDeleted),
				_ => messages.Where(x => x.ReceiverUsername == messageParams.Username && !x.ReceiverDeleted && x.DateRead == null)
			};

			return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
		}

		public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string receiverUsername)
		{
			var messages = await _context.Messages
			.Include(x => x.Sender).ThenInclude(x => x.Photos)
			.Include(x => x.Receiver).ThenInclude(x => x.Photos)
			.Where(x => x.Receiver.UserName == currentUsername && !x.ReceiverDeleted && x.Sender.UserName == receiverUsername || x.Receiver.UserName == receiverUsername && x.Sender.UserName == currentUsername && !x.SenderDeleted)
			.OrderBy(x => x.MessageSent)
			.ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
			.ToListAsync();

			var unreadMessages = messages.Where(x => x.DateRead == null && x.ReceiverUsername == currentUsername).ToList();

			if (unreadMessages.Any()) unreadMessages.ForEach(message => message.DateRead = DateTime.UtcNow);

			return messages;
		}

		public void RemoveConnection(Connection connection)
		{
			_context.Connections.Remove(connection);
		}
	}
}