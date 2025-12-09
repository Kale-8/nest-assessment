import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador personalizado para obtener el usuario autenticado desde el request
 * Uso: @CurrentUser() user: User
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
