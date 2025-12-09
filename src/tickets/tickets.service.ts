import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { Category } from '../categories/entities/category.entity';
import { Client } from '../clients/entities/client.entity';
import { Technician } from '../technicians/entities/technician.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

/**
 * Servicio de tickets
 * Contiene toda la lógica de negocio para gestión de tickets
 */
@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
        @InjectRepository(Client)
        private clientsRepository: Repository<Client>,
        @InjectRepository(Technician)
        private techniciansRepository: Repository<Technician>,
    ) { }

    /**
     * Crear un nuevo ticket
     * Validaciones:
     * - La categoría debe existir
     * - El cliente debe existir
     * - Si se asigna técnico, validar que no tenga más de 5 tickets en progreso
     */
    async create(createTicketDto: CreateTicketDto, userId: string) {
        // Validar que la categoría existe
        const category = await this.categoriesRepository.findOne({
            where: { id: createTicketDto.categoryId },
        });
        if (!category) {
            throw new NotFoundException('Categoría no encontrada');
        }

        // Validar que el cliente existe
        const client = await this.clientsRepository.findOne({
            where: { id: createTicketDto.clientId },
        });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        // Si se asigna técnico, validar disponibilidad
        if (createTicketDto.technicianId) {
            await this.validateTechnicianAvailability(createTicketDto.technicianId);
        }

        // Crear el ticket
        const ticket = this.ticketsRepository.create({
            ...createTicketDto,
            createdById: userId,
        });

        return await this.ticketsRepository.save(ticket);
    }

    /**
     * Obtener todos los tickets
     */
    async findAll() {
        return await this.ticketsRepository.find({
            relations: ['category', 'client', 'technician', 'createdBy'],
        });
    }

    /**
     * Obtener un ticket por ID
     */
    async findOne(id: string) {
        const ticket = await this.ticketsRepository.findOne({
            where: { id },
            relations: ['category', 'client', 'technician', 'createdBy'],
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
        }

        return ticket;
    }

    /**
     * Obtener tickets por cliente
     */
    async findByClient(clientId: string) {
        const client = await this.clientsRepository.findOne({
            where: { id: clientId },
        });

        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        return await this.ticketsRepository.find({
            where: { clientId },
            relations: ['category', 'client', 'technician', 'createdBy'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Obtener tickets por técnico
     */
    async findByTechnician(technicianId: string) {
        const technician = await this.techniciansRepository.findOne({
            where: { id: technicianId },
        });

        if (!technician) {
            throw new NotFoundException('Técnico no encontrado');
        }

        return await this.ticketsRepository.find({
            where: { technicianId },
            relations: ['category', 'client', 'technician', 'createdBy'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Actualizar el estado de un ticket
     * Validación: El estado debe seguir la secuencia OPEN → IN_PROGRESS → RESOLVED → CLOSED
     */
    async updateStatus(id: string, updateStatusDto: UpdateTicketStatusDto) {
        const ticket = await this.findOne(id);

        // Validar transición de estado
        this.validateStatusTransition(ticket.status, updateStatusDto.status);

        // Actualizar estado
        await this.ticketsRepository.update(id, { status: updateStatusDto.status });

        return await this.findOne(id);
    }

    /**
     * Validar que la transición de estado sea válida
     * Secuencia: OPEN → IN_PROGRESS → RESOLVED → CLOSED
     */
    private validateStatusTransition(
        currentStatus: TicketStatus,
        newStatus: TicketStatus,
    ) {
        const validTransitions = {
            [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
            [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED],
            [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
            [TicketStatus.CLOSED]: [], // No se puede cambiar desde cerrado
        };

        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new BadRequestException(
                `No se puede cambiar el estado de ${currentStatus} a ${newStatus}. ` +
                `Secuencia válida: OPEN → IN_PROGRESS → RESOLVED → CLOSED`,
            );
        }
    }

    /**
     * Validar que un técnico no tenga más de 5 tickets en progreso
     */
    private async validateTechnicianAvailability(technicianId: string) {
        const technician = await this.techniciansRepository.findOne({
            where: { id: technicianId },
        });

        if (!technician) {
            throw new NotFoundException('Técnico no encontrado');
        }

        // Contar tickets en progreso del técnico
        const inProgressCount = await this.ticketsRepository.count({
            where: {
                technicianId,
                status: TicketStatus.IN_PROGRESS,
            },
        });

        if (inProgressCount >= 5) {
            throw new BadRequestException(
                `El técnico ${technician.name} ya tiene 5 tickets en progreso. ` +
                `No puede asignarse más tickets hasta que resuelva algunos.`,
            );
        }
    }

    /**
     * Eliminar un ticket
     */
    async remove(id: string) {
        const ticket = await this.findOne(id);
        await this.ticketsRepository.remove(ticket);
        return { message: 'Ticket eliminado exitosamente' };
    }
}
