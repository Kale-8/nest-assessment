import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Guard para verificar que el usuario tenga el rol adecuado
 * Se usa en conjunto con el decorador @Roles()
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Obtener los roles requeridos del decorador @Roles()
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // Si no hay roles especificados, permitir acceso
        if (!requiredRoles) {
            return true;
        }

        // Obtener el usuario del request (ya autenticado por JwtAuthGuard)
        const { user } = context.switchToHttp().getRequest();

        // Verificar si el usuario tiene alguno de los roles requeridos
        return requiredRoles.some((role) => user.role === role);
    }
}
