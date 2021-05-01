import { Member } from "../_models/member";

export type UserWithPendingPhotos = Pick<Member, 'id' | 'knownAs' | 'photoUrl' | 'photos'>;
export type UsersWithPendingPhotos = UserWithPendingPhotos[];

export type UserPhotoApproval = { userId: number, photoId: number; };