import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    @IsNotEmpty()   
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(7)
    @IsNotEmpty()
    password: string;
}
