import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service.ts';
import { Comment } from './entities/comment.entity.ts';
import { CreateCommentDto } from './dtos/create-comment.dto.ts';
import { UpdateCommentDto } from './dtos/update-comment.dto.ts';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    async findAll(): Promise<Comment[]> {
        return await this.commentsService.findAll();
    }

    async findById(id: number): Promise<Comment> {
        return await this.commentsService.findById(id);
    }

    async create(createCommentDto: CreateCommentDto): Promise<Comment> {
        return this.commentsService.create(createCommentDto);
    }

    async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
        return await this.commentsService.update(id, updateCommentDto);
    }

    async delete(id: number): Promise<void> {
        return await this.commentsService.delete(id);
    }
}
