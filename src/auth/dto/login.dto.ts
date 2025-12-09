import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para el login de usuarios
 */
export class LoginDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'admin@techhelpdesk.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'admin123',
    })
    @IsString()
    @MinLength(6)
    password: string;
}
