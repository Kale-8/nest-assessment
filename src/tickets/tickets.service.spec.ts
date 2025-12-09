import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket, TicketStatus, TicketPriority } from './entities/ticket.entity';
import { Category } from '../categories/entities/category.entity';
import { Client } from '../clients/entities/client.entity';
import { Technician } from '../technicians/entities/technician.entity';

/**
 * Pruebas unitarias para TicketsService
 * Cobertura: creación de tickets y cambio de estado
 */
describe('TicketsService', () => {
    let service: TicketsService;
    let ticketsRepository: Repository<Ticket>;
    let categoriesRepository: Repository<Category>;
    let clientsRepository: Repository<Client>;
    let techniciansRepository: Repository<Technician>;

    // Datos de prueba
    const mockCategory = {
        id: 'category-uuid',
        name: 'Incidente de Hardware',
        description: 'Problemas de hardware',
    };

    const mockClient = {
        id: 'client-uuid',
        name: 'Cliente Test',
        company: 'Test Company',
        contactEmail: 'test@example.com',
    };

    const mockTechnician = {
        id: 'technician-uuid',
        name: 'Técnico Test',
        specialty: 'Hardware',
        availability: true,
    };

    const mockTicket = {
        id: 'ticket-uuid',
        title: 'Test Ticket',
        description: 'Descripción de prueba',
        status: TicketStatus.OPEN,
        priority: TicketPriority.MEDIUM,
        categoryId: 'category-uuid',
        clientId: 'client-uuid',
        technicianId: 'technician-uuid',
        createdById: 'user-uuid',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketsService,
                {
                    provide: getRepositoryToken(Ticket),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        count: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Category),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Client),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Technician),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TicketsService>(TicketsService);
        ticketsRepository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
        categoriesRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
        clientsRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
        techniciansRepository = module.get<Repository<Technician>>(getRepositoryToken(Technician));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    /**
     * TEST 1: Creación de tickets
     */
    describe('create', () => {
        it('debe crear un ticket exitosamente con datos válidos', async () => {
            const createTicketDto = {
                title: 'Computadora no enciende',
                description: 'La computadora no enciende desde esta mañana',
                categoryId: 'category-uuid',
                clientId: 'client-uuid',
                technicianId: 'technician-uuid',
                priority: TicketPriority.HIGH,
            };

            // Mock de repositorios
            jest.spyOn(categoriesRepository, 'findOne').mockResolvedValue(mockCategory as any);
            jest.spyOn(clientsRepository, 'findOne').mockResolvedValue(mockClient as any);
            jest.spyOn(techniciansRepository, 'findOne').mockResolvedValue(mockTechnician as any);
            jest.spyOn(ticketsRepository, 'count').mockResolvedValue(2); // Técnico tiene 2 tickets en progreso
            jest.spyOn(ticketsRepository, 'create').mockReturnValue(mockTicket as any);
            jest.spyOn(ticketsRepository, 'save').mockResolvedValue(mockTicket as any);

            const result = await service.create(createTicketDto, 'user-uuid');

            expect(result).toEqual(mockTicket);
            expect(categoriesRepository.findOne).toHaveBeenCalledWith({
                where: { id: createTicketDto.categoryId },
            });
            expect(clientsRepository.findOne).toHaveBeenCalledWith({
                where: { id: createTicketDto.clientId },
            });
            expect(ticketsRepository.save).toHaveBeenCalled();
        });

        it('debe lanzar NotFoundException si la categoría no existe', async () => {
            const createTicketDto = {
                title: 'Test',
                description: 'Test description',
                categoryId: 'invalid-category',
                clientId: 'client-uuid',
                priority: TicketPriority.MEDIUM,
            };

            jest.spyOn(categoriesRepository, 'findOne').mockResolvedValue(null);

            await expect(service.create(createTicketDto, 'user-uuid')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('debe lanzar NotFoundException si el cliente no existe', async () => {
            const createTicketDto = {
                title: 'Test',
                description: 'Test description',
                categoryId: 'category-uuid',
                clientId: 'invalid-client',
                priority: TicketPriority.MEDIUM,
            };

            jest.spyOn(categoriesRepository, 'findOne').mockResolvedValue(mockCategory as any);
            jest.spyOn(clientsRepository, 'findOne').mockResolvedValue(null);

            await expect(service.create(createTicketDto, 'user-uuid')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('debe lanzar BadRequestException si el técnico tiene 5 tickets en progreso', async () => {
            const createTicketDto = {
                title: 'Test',
                description: 'Test description',
                categoryId: 'category-uuid',
                clientId: 'client-uuid',
                technicianId: 'technician-uuid',
                priority: TicketPriority.MEDIUM,
            };

            jest.spyOn(categoriesRepository, 'findOne').mockResolvedValue(mockCategory as any);
            jest.spyOn(clientsRepository, 'findOne').mockResolvedValue(mockClient as any);
            jest.spyOn(techniciansRepository, 'findOne').mockResolvedValue(mockTechnician as any);
            jest.spyOn(ticketsRepository, 'count').mockResolvedValue(5); // Técnico ya tiene 5 tickets

            await expect(service.create(createTicketDto, 'user-uuid')).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    /**
     * TEST 2: Cambio de estado de tickets
     */
    describe('updateStatus', () => {
        it('debe actualizar el estado de OPEN a IN_PROGRESS correctamente', async () => {
            const ticketOpen = {
                ...mockTicket,
                status: TicketStatus.OPEN,
            };

            const ticketUpdated = {
                ...mockTicket,
                status: TicketStatus.IN_PROGRESS,
            };

            jest.spyOn(ticketsRepository, 'findOne')
                .mockResolvedValueOnce(ticketOpen as any)
                .mockResolvedValueOnce(ticketUpdated as any);
            jest.spyOn(ticketsRepository, 'update').mockResolvedValue(undefined);

            const result = await service.updateStatus('ticket-uuid', {
                status: TicketStatus.IN_PROGRESS,
            });

            expect(result.status).toBe(TicketStatus.IN_PROGRESS);
            expect(ticketsRepository.update).toHaveBeenCalledWith('ticket-uuid', {
                status: TicketStatus.IN_PROGRESS,
            });
        });

        it('debe actualizar el estado de IN_PROGRESS a RESOLVED correctamente', async () => {
            const ticketInProgress = {
                ...mockTicket,
                status: TicketStatus.IN_PROGRESS,
            };

            const ticketResolved = {
                ...mockTicket,
                status: TicketStatus.RESOLVED,
            };

            jest.spyOn(ticketsRepository, 'findOne')
                .mockResolvedValueOnce(ticketInProgress as any)
                .mockResolvedValueOnce(ticketResolved as any);
            jest.spyOn(ticketsRepository, 'update').mockResolvedValue(undefined);

            const result = await service.updateStatus('ticket-uuid', {
                status: TicketStatus.RESOLVED,
            });

            expect(result.status).toBe(TicketStatus.RESOLVED);
        });

        it('debe lanzar BadRequestException al intentar saltar estados', async () => {
            const ticketOpen = {
                ...mockTicket,
                status: TicketStatus.OPEN,
            };

            jest.spyOn(ticketsRepository, 'findOne').mockResolvedValue(ticketOpen as any);

            // Intentar cambiar de OPEN a RESOLVED (saltando IN_PROGRESS)
            await expect(
                service.updateStatus('ticket-uuid', { status: TicketStatus.RESOLVED }),
            ).rejects.toThrow(BadRequestException);
        });

        it('debe lanzar BadRequestException al intentar retroceder estados', async () => {
            const ticketResolved = {
                ...mockTicket,
                status: TicketStatus.RESOLVED,
            };

            jest.spyOn(ticketsRepository, 'findOne').mockResolvedValue(ticketResolved as any);

            // Intentar cambiar de RESOLVED a IN_PROGRESS (retroceso)
            await expect(
                service.updateStatus('ticket-uuid', { status: TicketStatus.IN_PROGRESS }),
            ).rejects.toThrow(BadRequestException);
        });

        it('debe lanzar BadRequestException al intentar cambiar desde CLOSED', async () => {
            const ticketClosed = {
                ...mockTicket,
                status: TicketStatus.CLOSED,
            };

            jest.spyOn(ticketsRepository, 'findOne').mockResolvedValue(ticketClosed as any);

            // Un ticket cerrado no puede cambiar de estado
            await expect(
                service.updateStatus('ticket-uuid', { status: TicketStatus.OPEN }),
            ).rejects.toThrow(BadRequestException);
        });
    });
});
