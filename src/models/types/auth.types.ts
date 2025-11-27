import { IAuthSession } from "../AuthSession";
import { IFarmer } from "../Farmer";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  farmer: IFarmer;
  tokens: AuthTokens;
  session: IAuthSession;
}
