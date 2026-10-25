import { IsBoolean, IsEnum, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from "class-validator";
import { TicketUrgency } from "../enums/ticket-urgency.enums.ts";

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    desc: string;

    @IsOptional()
    @IsEnum(TicketUrgency)
    urgency?: TicketUrgency;

    @IsOptional()
    @IsBoolean()
    allowComments?: boolean;

    @IsNumber()
    bId: number;

    @IsNumber()
    uId: number;
}
