using System;

namespace API.DTOs
{
    public class MessageDto
    {
         public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderUsername { get; set; }
        public string SenderPhotoUrl { get; set; }
        public string SenderGender { get; set; }
        public int ReceiverId { get; set; }
        public string ReceiverUsername { get; set; }
        public string ReceiverPhotoUrl { get; set; }
        public string ReceiverGender { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
		public DateTime MessageSent { get; set; }
    }
}