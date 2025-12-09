import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technician } from './entities/technician.entity';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';

@Injectable()
export class TechniciansService {
    constructor(
        @InjectRepository(Technician)
        private techniciansRepository: Repository<Technician>,
    ) { }

    async create(createTechnicianDto: CreateTechnicianDto) {
        const technician = this.techniciansRepository.create(createTechnicianDto);
        return await this.techniciansRepository.save(technician);
    }

    async findAll() {
        return await this.techniciansRepository.find();
    }

    async findOne(id: string) {
        const technician = await this.techniciansRepository.findOne({ where: { id } });
        if (!technician) {
            throw new NotFoundException(`Técnico con ID ${id} no encontrado`);
        }
        return technician;
    }

    async update(id: string, updateTechnicianDto: UpdateTechnicianDto) {
        await this.findOne(id);
        await this.techniciansRepository.update(id, updateTechnicianDto);
        return await this.findOne(id);
    }

    async remove(id: string) {
        const technician = await this.findOne(id);
        await this.techniciansRepository.remove(technician);
        return { message: 'Técnico eliminado exitosamente' };
    }
}
