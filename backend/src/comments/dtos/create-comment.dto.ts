import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    text: string;

    @IsNumber()
    ticketId: number;
}
