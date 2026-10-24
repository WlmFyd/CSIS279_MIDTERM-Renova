import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.ts';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto.ts';
import { UpdateUserDto } from './dtos/update-user.dto.ts';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepo.find();
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException(`User of id ${id} not found`);
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        const user = this.userRepo.create({
            ...createUserDto,
            password: hashedPassword
        });
        const savedUser = await this.userRepo.save(user);
        return this.findById(savedUser.id);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const {password, ...updates} = updateUserDto;
        const user = await this.userRepo.preload({ 
            id, ...updates 
        });
        if (!user) throw new NotFoundException(`User of id ${id} not found`);
        if (password !== undefined && password !== null) {
            user.password = await bcrypt.hash(password, 12)
        }
        return this.userRepo.save(user);
    }

    async delete(id: number): Promise<void> {
        const result = await this.userRepo.delete(id);
        if (result.affected===0) throw new NotFoundException(`User of id ${id} not found`)
    }
}
