import { Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from '../entities/zone.entity';
import { DailyLog } from '../entities/daily-log.entity';
import { Crew } from '../entities/crew.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zone, DailyLog, Crew])],
  controllers: [ZonesController],
  providers: [ZonesService],
})
export class ZonesModule { }
