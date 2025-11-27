import { IFarmer } from "../Farmer";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  preferredLanguage?: "bn" | "en";
  location?: IFarmer["location"];
}

export interface LoginInput {
  email: string;
  password: string;
}