import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Decorador personalizado para especificar los roles permitidos en un endpoint
 * Uso: @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
