import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crew } from '../entities/crew.entity';
import { Zone } from '../entities/zone.entity';

@Injectable()
export class CrewsService {
  constructor(
    @InjectRepository(Crew)
    private crewRepository: Repository<Crew>,
    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,
  ) { }

  async create(createCrewDto: CreateCrewDto) {
    const { zoneId, ...crewData } = createCrewDto;

    const zone = await this.zoneRepository.findOne({ where: { id: zoneId } });
    if (!zone) {
      throw new NotFoundException(`Zone with ID ${zoneId} not found`);
    }

    const crew = this.crewRepository.create({
      ...crewData,
      zone,
    });

    return this.crewRepository.save(crew);
  }

  findAll() {
    return this.crewRepository.find({ relations: ['zone'] });
  }

  findOne(id: string) {
    return this.crewRepository.findOne({ where: { id }, relations: ['zone'] });
  }

  async update(id: string, updateCrewDto: UpdateCrewDto) {
    const crew = await this.crewRepository.findOne({ where: { id }, relations: ['zone'] });

    if (!crew) {
      throw new NotFoundException(`Crew with ID ${id} not found`);
    }

    if (updateCrewDto.zoneId) {
      const zone = await this.zoneRepository.findOne({ where: { id: updateCrewDto.zoneId } });
      if (!zone) {
        throw new NotFoundException(`Zone with ID ${updateCrewDto.zoneId} not found`);
      }
      crew.zone = zone;
    }

    Object.assign(crew, updateCrewDto);

    return this.crewRepository.save(crew);
  }

  async remove(id: string) {
    const crew = await this.crewRepository.findOne({ where: { id } });

    if (!crew) {
      throw new NotFoundException(`Crew with ID ${id} not found`);
    }

    await this.crewRepository.delete(id);
    return { message: 'Crew deleted successfully' };
  }
}
