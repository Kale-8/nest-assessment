import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Clients')
@ApiBearerAuth('JWT-auth')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo cliente (Solo Admin)' })
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientsService.create(createClientDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los clientes (Solo Admin)' })
    findAll() {
        return this.clientsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un cliente por ID (Solo Admin)' })
    findOne(@Param('id') id: string) {
        return this.clientsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un cliente (Solo Admin)' })
    update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
        return this.clientsService.update(id, updateClientDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un cliente (Solo Admin)' })
    remove(@Param('id') id: string) {
        return this.clientsService.remove(id);
    }
}
