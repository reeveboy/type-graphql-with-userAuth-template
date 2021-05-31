import { Field, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { IsEmailAlreadyExist } from "../resolvers/user/IsEmailAlreadyExists";
import { PasswordInput } from "./PasswordInput";

@InputType()
export class RegisterInput extends PasswordInput {
  @Field()
  @Length(2, 255)
  name: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "An account with that email already exists" })
  email: string;
}
