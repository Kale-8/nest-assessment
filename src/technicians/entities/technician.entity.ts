import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';

/**
 * Entidad Technician - Representa los técnicos que resuelven tickets
 * Relaciones:
 * - Un técnico puede tener muchos tickets asignados
 */
@Entity('technicians')
export class Technician {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    specialty: string;

    @Column({ type: 'boolean', default: true })
    availability: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relación: Un técnico puede tener muchos tickets asignados
    @OneToMany(() => Ticket, (ticket) => ticket.technician)
    tickets: Ticket[];
}
