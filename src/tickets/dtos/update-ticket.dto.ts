import { PartialType } from "@nestjs/mapped-types";
import { CreateTickerDto } from "./create-ticket.dto.ts";

export class TicketUpdateDto extends PartialType(CreateTickerDto) {}
