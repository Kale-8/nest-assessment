import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * DTO para crear un usuario
 */
export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'María González',
    })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'maria.gonzalez@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario (mínimo 6 caracteres)',
        example: 'password123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'Rol del usuario',
        enum: UserRole,
        example: UserRole.TECHNICIAN,
    })
    @IsEnum(UserRole)
    role: UserRole;
}
