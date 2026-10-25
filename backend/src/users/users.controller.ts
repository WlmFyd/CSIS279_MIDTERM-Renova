import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service.ts';
import { User } from './entities/user.entity.ts';
import { CreateUserDto } from './dtos/create-user.dto.ts';
import { UpdateUserDto } from './dtos/update-user.dto.ts';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return await this.usersService.findById(id);
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return await this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.usersService.delete(id);
    }

}
