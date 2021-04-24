import { Gender } from "../_enums/gender.enum";
import { Photo } from "./photo";

export interface RegisterDto {
	username: string;
	password: string;
	dateOfBirth: Date;
	knownAs: string;
	gender: Gender;
	country: string;
	city: string;
	photos: Photo[];
	introduction?: string;
	lookingFor?: string;
	interests?: string;	
}