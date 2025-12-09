import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private clientsRepository: Repository<Client>,
    ) { }

    async create(createClientDto: CreateClientDto) {
        const existing = await this.clientsRepository.findOne({
            where: { contactEmail: createClientDto.contactEmail },
        });

        if (existing) {
            throw new ConflictException('El email de contacto ya está registrado');
        }

        const client = this.clientsRepository.create(createClientDto);
        return await this.clientsRepository.save(client);
    }

    async findAll() {
        return await this.clientsRepository.find();
    }

    async findOne(id: string) {
        const client = await this.clientsRepository.findOne({ where: { id } });
        if (!client) {
            throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        return client;
    }

    async update(id: string, updateClientDto: UpdateClientDto) {
        const client = await this.findOne(id);

        if (updateClientDto.contactEmail && updateClientDto.contactEmail !== client.contactEmail) {
            const existing = await this.clientsRepository.findOne({
                where: { contactEmail: updateClientDto.contactEmail },
            });
            if (existing) {
                throw new ConflictException('El email de contacto ya está registrado');
            }
        }

        await this.clientsRepository.update(id, updateClientDto);
        return await this.findOne(id);
    }

    async remove(id: string) {
        const client = await this.findOne(id);
        await this.clientsRepository.remove(client);
        return { message: 'Cliente eliminado exitosamente' };
    }
}
