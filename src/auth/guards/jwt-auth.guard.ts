import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para proteger rutas que requieren autenticación JWT
 * Verifica que el token JWT sea válido
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
