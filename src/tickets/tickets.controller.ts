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
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

/**
 * Controlador de tickets
 * Diferentes endpoints según el rol del usuario
 */
@ApiTags('Tickets')
@ApiBearerAuth('JWT-auth')
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @Roles(UserRole.CLIENT, UserRole.ADMIN)
    @ApiOperation({
        summary: 'Crear un nuevo ticket',
        description: 'Permite a clientes y administradores crear tickets de soporte',
    })
    @ApiResponse({
        status: 201,
        description: 'Ticket creado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Categoría o cliente no encontrado',
    })
    @ApiResponse({
        status: 400,
        description: 'Técnico tiene más de 5 tickets en progreso',
    })
    create(@Body() createTicketDto: CreateTicketDto, @CurrentUser() user: any) {
        return this.ticketsService.create(createTicketDto, user.id);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Listar todos los tickets (Solo Admin)',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de todos los tickets',
    })
    findAll() {
        return this.ticketsService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.CLIENT)
    @ApiOperation({
        summary: 'Obtener un ticket por ID',
        description: 'Permite obtener los detalles de un ticket específico',
    })
    @ApiResponse({
        status: 200,
        description: 'Ticket encontrado',
    })
    @ApiResponse({
        status: 404,
        description: 'Ticket no encontrado',
    })
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @Get('client/:id')
    @Roles(UserRole.CLIENT, UserRole.ADMIN)
    @ApiOperation({
        summary: 'Obtener historial de tickets por cliente',
        description: 'Permite a clientes ver su historial y a admins ver el historial de cualquier cliente',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de tickets del cliente',
    })
    @ApiResponse({
        status: 404,
        description: 'Cliente no encontrado',
    })
    findByClient(@Param('id') clientId: string) {
        return this.ticketsService.findByClient(clientId);
    }

    @Get('technician/:id')
    @Roles(UserRole.TECHNICIAN, UserRole.ADMIN)
    @ApiOperation({
        summary: 'Obtener tickets asignados a un técnico',
        description: 'Permite a técnicos ver sus tickets asignados y a admins ver los tickets de cualquier técnico',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de tickets del técnico',
    })
    @ApiResponse({
        status: 404,
        description: 'Técnico no encontrado',
    })
    findByTechnician(@Param('id') technicianId: string) {
        return this.ticketsService.findByTechnician(technicianId);
    }

    @Patch(':id/status')
    @Roles(UserRole.TECHNICIAN, UserRole.ADMIN)
    @ApiOperation({
        summary: 'Actualizar el estado de un ticket',
        description: 'Permite a técnicos y admins cambiar el estado del ticket. Debe seguir la secuencia: OPEN → IN_PROGRESS → RESOLVED → CLOSED',
    })
    @ApiResponse({
        status: 200,
        description: 'Estado actualizado exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Transición de estado inválida',
    })
    @ApiResponse({
        status: 404,
        description: 'Ticket no encontrado',
    })
    updateStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateTicketStatusDto,
    ) {
        return this.ticketsService.updateStatus(id, updateStatusDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Eliminar un ticket (Solo Admin)',
    })
    @ApiResponse({
        status: 200,
        description: 'Ticket eliminado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Ticket no encontrado',
    })
    remove(@Param('id') id: string) {
        return this.ticketsService.remove(id);
    }
}
