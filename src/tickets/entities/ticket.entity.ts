import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Client } from '../../clients/entities/client.entity';
import { Technician } from '../../technicians/entities/technician.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Enum para el estado del ticket
 * Secuencia válida: OPEN → IN_PROGRESS → RESOLVED → CLOSED
 */
export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

/**
 * Enum para la prioridad del ticket
 */
export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

/**
 * Entidad Ticket - Representa los tickets de soporte técnico
 * Relaciones:
 * - Muchos tickets pertenecen a una categoría
 * - Muchos tickets pertenecen a un cliente
 * - Muchos tickets pueden ser asignados a un técnico
 * - Muchos tickets son creados por un usuario
 */
@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    })
    status: TicketStatus;

    @Column({
        type: 'enum',
        enum: TicketPriority,
        default: TicketPriority.MEDIUM,
    })
    priority: TicketPriority;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relación: Muchos tickets pertenecen a una categoría
    @ManyToOne(() => Category, (category) => category.tickets, {
        nullable: false,
        onDelete: 'RESTRICT', // No permitir eliminar categoría si tiene tickets
    })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'category_id' })
    categoryId: string;

    // Relación: Muchos tickets pertenecen a un cliente
    @ManyToOne(() => Client, (client) => client.tickets, {
        nullable: false,
        onDelete: 'RESTRICT', // No permitir eliminar cliente si tiene tickets
    })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @Column({ name: 'client_id' })
    clientId: string;

    // Relación: Muchos tickets pueden ser asignados a un técnico (opcional)
    @ManyToOne(() => Technician, (technician) => technician.tickets, {
        nullable: true,
        onDelete: 'SET NULL', // Si se elimina el técnico, el ticket queda sin asignar
    })
    @JoinColumn({ name: 'technician_id' })
    technician: Technician;

    @Column({ name: 'technician_id', nullable: true })
    technicianId: string;

    // Relación: Muchos tickets son creados por un usuario
    @ManyToOne(() => User, (user) => user.tickets, {
        nullable: false,
        onDelete: 'RESTRICT', // No permitir eliminar usuario si tiene tickets
    })
    @JoinColumn({ name: 'created_by_id' })
    createdBy: User;

    @Column({ name: 'created_by_id' })
    createdById: string;
}
