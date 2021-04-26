import { Gender } from "../_enums/gender.enum";

export interface Message {
	id: number;
	senderId: number;
	senderUsername: string;
	senderPhotoUrl: string;
	senderGender: Gender;
	receiverId: number;
	receiverUsername: string;
	receiverPhotoUrl: string;
	receiverGender: Gender;
	content: string;
	dateRead?: Date;
	messageSent: Date;
}