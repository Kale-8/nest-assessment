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
 * Entidad Category - Representa las categorías de incidencias
 * Tipos: Solicitud, Incidente de Hardware, Incidente de Software
 * Relaciones:
 * - Una categoría puede tener muchos tickets
 */
@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relación: Una categoría puede tener muchos tickets
    @OneToMany(() => Ticket, (ticket) => ticket.category)
    tickets: Ticket[];
}
