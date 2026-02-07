import { Module } from '@nestjs/common';
import { CrewsService } from './crews.service';
import { CrewsController } from './crews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crew } from '../entities/crew.entity';
import { Zone } from '../entities/zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crew, Zone])],
  controllers: [CrewsController],
  providers: [CrewsService],
})
export class CrewsModule { }
