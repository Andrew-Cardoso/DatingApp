using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	public class MessagesController : BaseApiController
	{
		private readonly IUserRepository _userRepository;
		private readonly IMessageRepository _messageRepository;
		private readonly IMapper _mapper;
		public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository, IMapper mapper)
		{
			_mapper = mapper;
			_messageRepository = messageRepository;
			_userRepository = userRepository;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
		{
			messageParams.Username = User.GetUsername();

			var messages = await _messageRepository.GetMessagesForUser(messageParams);

			Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);

			return messages;
		}

		[HttpGet("thread/{username}")]
		public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username) 
		{
			var currentUsername = User.GetUsername();

			return Ok(await _messageRepository.GetMessageThread(currentUsername, username));
		}

		[HttpPost]
		public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
		{
			string username = User.GetUsername();
			if (username == createMessageDto.ReceiverUsername.ToLower()) return BadRequest("You cannot send messages to yourself");

			var sender = await _userRepository.GetUserAsync(username);
			var receiver = await _userRepository.GetUserAsync(createMessageDto.ReceiverUsername);

			if (receiver == null) return NotFound();

			var message = new Message
			{
				Sender = sender,
				Receiver = receiver,
				SenderUsername = sender.UserName,
				ReceiverUsername = receiver.UserName,
				Content = createMessageDto.Content
			};

			_messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));

			return BadRequest("Failed to send message");
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult> DeleteMessage(int id)
		{
			string username = User.GetUsername();
			Message message = await _messageRepository.GetMessage(id);
			if (message.Sender.UserName != username && message.Receiver.UserName != username) return Unauthorized();

			if (message.Sender.UserName == username) message.SenderDeleted = true;
			if (message.Receiver.UserName == username) message.ReceiverDeleted = true;

			if (message.SenderDeleted && message.ReceiverDeleted) _messageRepository.DeleteMessage(message);

			if (await _messageRepository.SaveAllAsync()) return Ok();

			return BadRequest("Problem deleting the message");

		}
	}
}