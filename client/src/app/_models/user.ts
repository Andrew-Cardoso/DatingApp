import { Roles } from "../_enums/roles.enum";

export interface User {
  username: string;
  token: string;
  photoUrl: string;
  knownAs: string;
  gender: string;
  roles: Roles[];
}
