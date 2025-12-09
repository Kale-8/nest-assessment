import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Technicians')
@ApiBearerAuth('JWT-auth')
@Controller('technicians')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class TechniciansController {
    constructor(private readonly techniciansService: TechniciansService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo técnico (Solo Admin)' })
    create(@Body() createTechnicianDto: CreateTechnicianDto) {
        return this.techniciansService.create(createTechnicianDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los técnicos (Solo Admin)' })
    findAll() {
        return this.techniciansService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un técnico por ID (Solo Admin)' })
    findOne(@Param('id') id: string) {
        return this.techniciansService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un técnico (Solo Admin)' })
    update(@Param('id') id: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
        return this.techniciansService.update(id, updateTechnicianDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un técnico (Solo Admin)' })
    remove(@Param('id') id: string) {
        return this.techniciansService.remove(id);
    }
}
