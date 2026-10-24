import { Module } from '@nestjs/common';
import { BuildingService } from './building.service.js';
import { BuildingController } from './building.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity.ts';

@Module({
  imports:[TypeOrmModule.forFeature([Building])],
  providers: [BuildingService],
  controllers: [BuildingController],
  exports: [BuildingModule]
})
export class BuildingModule {}
