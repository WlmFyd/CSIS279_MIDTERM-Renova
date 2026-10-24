import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity.ts';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto.ts';
import { UpdateCommentDto } from './dtos/update-comment.dto.ts';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>
    ) {}

    async findAll(): Promise<Comment[]> {
        return await this.commentRepo.find();
    }

    async findById(id: number): Promise<Comment> {
        const comment =  await this.commentRepo.findOneBy({ id });
        if (!comment) throw new NotFoundException(`Comment of id ${id} not found`);
        return comment;
    }

    async create(createCommentDto: CreateCommentDto): Promise<Comment> {
        const comment =  this.commentRepo.create(createCommentDto);
        return comment;
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
