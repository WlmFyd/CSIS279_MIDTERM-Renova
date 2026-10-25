import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TicketsService } from './tickets.service.ts';
import { Ticket } from './entities/ticket.entity.ts';
import { CreateTicketDto } from './dtos/create-ticket.dto.ts';
import { UpdateTicketDto } from './dtos/update-ticket.dto.ts';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}
    
    @Get()
    async findAll(): Promise<Ticket[]> {
        return await this.ticketsService.findAll();
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<Ticket> {
        return await this.ticketsService.findById(id);
    }

    @Post()
    async create(@Body() createTicketDto: CreateTicketDto): Promise<Ticket> {
        return this.ticketsService.create(createTicketDto);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateTicketDto: UpdateTicketDto): Promise<Ticket> {
        return await this.ticketsService.update(id, updateTicketDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.ticketsService.delete(id)
    }
}
