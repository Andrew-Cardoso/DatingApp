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
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		public MessagesController(IMapper mapper, IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
		{
			messageParams.Username = User.GetUsername();

			var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

			Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);

			return messages;
		}

		[HttpPost]
		public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
		{
			string username = User.GetUsername();
			if (username == createMessageDto.ReceiverUsername.ToLower()) return BadRequest("You cannot send messages to yourself");

			var sender = await _unitOfWork.UserRepository.GetUserAsync(username);
			var receiver = await _unitOfWork.UserRepository.GetUserAsync(createMessageDto.ReceiverUsername);

			if (receiver == null) return NotFound();

			var message = new Message
			{
				Sender = sender,
				Receiver = receiver,
				SenderUsername = sender.UserName,
				ReceiverUsername = receiver.UserName,
				Content = createMessageDto.Content
			};

			_unitOfWork.MessageRepository.AddMessage(message);

			if (await _unitOfWork.Complete()) return Ok(_mapper.Map<MessageDto>(message));

			return BadRequest("Failed to send message");
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult> DeleteMessage(int id)
		{
			string username = User.GetUsername();
			Message message = await _unitOfWork.MessageRepository.GetMessage(id);
			if (message.Sender.UserName != username && message.Receiver.UserName != username) return Unauthorized();

			if (message.Sender.UserName == username) message.SenderDeleted = true;
			if (message.Receiver.UserName == username) message.ReceiverDeleted = true;

			if (message.SenderDeleted && message.ReceiverDeleted) _unitOfWork.MessageRepository.DeleteMessage(message);

			if (await _unitOfWork.Complete()) return Ok();

			return BadRequest("Problem deleting the message");

		}
	}
}