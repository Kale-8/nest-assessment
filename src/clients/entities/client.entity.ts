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
 * Entidad Client - Representa los clientes que reportan tickets
 * Relaciones:
 * - Un cliente puede tener muchos tickets
 */
@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    company: string;

    @Column({ type: 'varchar', length: 100, unique: true, name: 'contact_email' })
    contactEmail: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relación: Un cliente puede tener muchos tickets
    @OneToMany(() => Ticket, (ticket) => ticket.client)
    tickets: Ticket[];
}
