import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Nombre de la categoría',
        example: 'Incidente de Hardware',
    })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'Descripción de la categoría',
        example: 'Problemas relacionados con hardware de computadoras',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
}
