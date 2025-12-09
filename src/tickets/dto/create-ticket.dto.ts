import { IsString, MinLength, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
    @ApiProperty({
        description: 'Título del ticket',
        example: 'Computadora no enciende',
    })
    @IsString()
    @MinLength(5)
    title: string;

    @ApiProperty({
        description: 'Descripción detallada del problema',
        example: 'La computadora del área de ventas no enciende desde esta mañana. Se escucha un pitido al presionar el botón de encendido.',
    })
    @IsString()
    @MinLength(10)
    description: string;

    @ApiProperty({
        description: 'ID de la categoría del ticket',
        example: 'uuid-categoria',
    })
    @IsUUID()
    categoryId: string;

    @ApiProperty({
        description: 'ID del cliente que reporta el ticket',
        example: 'uuid-cliente',
    })
    @IsUUID()
    clientId: string;

    @ApiProperty({
        description: 'Prioridad del ticket',
        enum: TicketPriority,
        example: TicketPriority.HIGH,
        required: false,
        default: TicketPriority.MEDIUM,
    })
    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @ApiProperty({
        description: 'ID del técnico asignado (opcional)',
        example: 'uuid-tecnico',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    technicianId?: string;
}
