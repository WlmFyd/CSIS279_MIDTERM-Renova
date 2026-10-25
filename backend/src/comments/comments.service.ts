import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity.ts';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto.ts';
import { UpdateCommentDto } from './dtos/update-comment.dto.ts';
import { Ticket } from '../tickets/entities/ticket.entity.ts';
import { User } from '../users/entities/user.entity.ts';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,

        @InjectRepository(Ticket)
        private readonly ticketRepo: Repository<Ticket>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async findAll(): Promise<Comment[]> {
        return await this.commentRepo.find();
    }

    async findForTicket(id: number): Promise<Comment[]> {
        const ticket = await this.ticketRepo.findOneBy({ id })
        if (!ticket) { throw new NotFoundException(`Ticket ${id} does not exist`); }
        return await this.commentRepo.find({ where: {ticket: {id} } })
    }

    async findById(id: number): Promise<Comment> {
        const comment =  await this.commentRepo.findOneBy({ id });
        if (!comment) throw new NotFoundException(`Comment of id ${id} not found`);
        return comment;
    }

    async create(createCommentDto: CreateCommentDto, tId: number, uId: number): Promise<Comment> {
        const ticket = await this.ticketRepo.findOneBy({ id: tId });
        const user = await this.userRepo.findOneBy({ id: uId });

        if (!ticket) { throw new NotFoundException(`Ticket ${tId} does not exist`); }
        if (!user) { throw new NotFoundException(`User ${uId} does not exist`); }

        const comment =  this.commentRepo.create({
            ...createCommentDto,
            fromUser: user,
            ticket: ticket
        });
        return this.commentRepo.save(comment);
    }

    async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
        const comment = await this.commentRepo.preload({ id, ...updateCommentDto });
        if (!comment) throw new NotFoundException(`Comment of id ${id} not found`);
        return this.commentRepo.save(comment);
    }

    async delete(id: number): Promise<void> {
        const result = await this.commentRepo.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Comment of id ${id} not found`)
    }
}
