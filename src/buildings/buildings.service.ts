import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity.ts';
import { Repository } from 'typeorm';
import { CreateBuildingDto } from './dtos/create-building.dto.ts';
import { UpdateBuildingDto } from './dtos/update-building.dto.ts';
import { User } from '../users/entities/user.entity.ts';

@Injectable()
export class BuildingsService {
    constructor(
        @InjectRepository(Building)
        private readonly buildingRepo: Repository<Building>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async findAll(): Promise<Building[]> {
        return await this.buildingRepo.find();
    }

    async findById(id: number): Promise<Building> {
        const building = await this.buildingRepo.findOneBy({ id });
        if (!building) throw new NotFoundException(`Building of id ${id} not found`);
        return building;
    }

    async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
        const building = this.buildingRepo.create(createBuildingDto);
        return this.buildingRepo.save(building);
    }

    async update(id: number, updateBuildingDto: UpdateBuildingDto): Promise<Building> {
        const building = await this.buildingRepo.preload({ id, ...updateBuildingDto });
        if (!building) throw new NotFoundException(`Building of id ${id} not found`);
        return this.buildingRepo.save(building);
    }

    async delete(id: number): Promise<void> {
        const result = await this.buildingRepo.delete(id);
        if (result.affected===0) throw new NotFoundException(`Building of id ${id} not found`);
    }

    // logic
    async join(bId: number, uId: number): Promise<{ message: string }> {
        const user = await this.userRepo.findOne({
            where: { id: uId },
            relations: { in: true }
        });
        const building = await this.buildingRepo.findOneBy({ id: bId });

        if (!user) {
            throw new NotFoundException(`User of id ${uId} does not exist`);
        }
        if (!building) {
            throw new NotFoundException(`Building of id ${bId} does not exist`);
        }
        
        const isMember = user.in.some(bdg => bdg.id === bId);

        if (!isMember) {
            user.in.push(building);
            await this.userRepo.save(user);

            return {
                message: `User ${uId} successfuly joined building ${bId}`
            }
        } else {
            throw new ConflictException(`User of id ${uId} is already a member of building of ${bId}`)
        }
    }

    async leave(bId: number, uId: number): Promise<{message: string}> {
        const user = await this.userRepo.findOne({
            where: { id: uId },
            relations: { in: true }
        });
        const building = await this.buildingRepo.findOneBy({ id: bId });

        if (!user) {
            throw new NotFoundException(`User of id ${uId} does not exist`);
        }
        if (!building) {
            throw new NotFoundException(`Building of id ${bId} does not exist`);
        }
        
        const isMember = user.in.some(bdg => bdg.id === bId);

        if (isMember) {
            user.in = user.in.filter(blg => blg.id !== bId)
            this.userRepo.save(user)

            return {
                message: `User ${uId} successfully left building ${bId}`
            }
        } else {
            throw new ConflictException(`User ${uId} is not a member of building ${bId}`)
        }
    }
}
