import { IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTechnicianDto {
    @ApiProperty({
        description: 'Nombre del técnico',
        example: 'Ana Martínez',
    })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'Especialidad del técnico',
        example: 'Redes y Conectividad',
    })
    @IsString()
    @MinLength(3)
    specialty: string;

    @ApiProperty({
        description: 'Disponibilidad del técnico',
        example: true,
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    availability?: boolean;
}
