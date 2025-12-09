import { IsString, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
    @ApiProperty({
        description: 'Nombre del cliente',
        example: 'Carlos Rodríguez',
    })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'Nombre de la empresa',
        example: 'Tech Solutions S.A.',
    })
    @IsString()
    @MinLength(3)
    company: string;

    @ApiProperty({
        description: 'Email de contacto del cliente',
        example: 'carlos.rodriguez@techsolutions.com',
    })
    @IsEmail()
    contactEmail: string;
}
