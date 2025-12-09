import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

/**
 * Controlador de usuarios
 * Solo accesible para administradores
 */
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo usuario (Solo Admin)' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
    @ApiResponse({ status: 409, description: 'El email ya está registrado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'No autorizado (requiere rol Admin)' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los usuarios (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'No autorizado (requiere rol Admin)' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un usuario por ID (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'No autorizado (requiere rol Admin)' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un usuario (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiResponse({ status: 409, description: 'El email ya está registrado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'No autorizado (requiere rol Admin)' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un usuario (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'No autorizado (requiere rol Admin)' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
