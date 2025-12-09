import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Ticket } from '../../tickets/entities/ticket.entity';

/**
 * Enum para los roles de usuario
 */
export enum UserRole {
    ADMIN = 'admin',
    TECHNICIAN = 'technician',
    CLIENT = 'client',
}

/**
 * Entidad User - Representa los usuarios del sistema
 * Relaciones:
 * - Un usuario puede crear muchos tickets
 */
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar' })
    @Exclude() // Excluir password de las respuestas
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CLIENT,
    })
    role: UserRole;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relación: Un usuario puede crear muchos tickets
    @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
    tickets: Ticket[];
}
