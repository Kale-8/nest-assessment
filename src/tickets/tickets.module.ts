import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { Category } from '../categories/entities/category.entity';
import { Client } from '../clients/entities/client.entity';
import { Technician } from '../technicians/entities/technician.entity';

/**
 * Módulo de tickets
 * Importa todas las entidades necesarias para las relaciones
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([Ticket, Category, Client, Technician]),
    ],
    controllers: [TicketsController],
    providers: [TicketsService],
    exports: [TicketsService],
})
export class TicketsModule { }
