import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

/**
 * DTO para el registro de usuarios
 */
export class RegisterDto {
    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez',
    })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juan.perez@example.com',
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
        example: UserRole.CLIENT,
        required: false,
        default: UserRole.CLIENT,
    })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
