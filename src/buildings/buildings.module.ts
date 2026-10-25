import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service.ts';
import { BuildingsController } from './buildings.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity.ts';

@Module({
  imports:[TypeOrmModule.forFeature([Building])],
  providers: [BuildingsService],
  controllers: [BuildingsController],
  exports: [BuildingsService]
})
export class BuildingsModule {}
