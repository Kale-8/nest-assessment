import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Controlador de autenticación
 * Endpoints públicos para registro y login
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({
        summary: 'Registrar un nuevo usuario',
        description: 'Crea un nuevo usuario en el sistema y retorna un token JWT',
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente',
        schema: {
            example: {
                success: true,
                data: {
                    user: {
                        id: 'uuid',
                        name: 'Juan Pérez',
                        email: 'juan.perez@example.com',
                        role: 'client',
                    },
                    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                message: 'Operación exitosa',
            },
        },
    })
    @ApiResponse({
        status: 409,
        description: 'El email ya está registrado',
    })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Autentica un usuario y retorna un token JWT',
    })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
        schema: {
            example: {
                success: true,
                data: {
                    user: {
                        id: 'uuid',
                        name: 'Admin User',
                        email: 'admin@techhelpdesk.com',
                        role: 'admin',
                    },
                    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                message: 'Operación exitosa',
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales inválidas',
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
