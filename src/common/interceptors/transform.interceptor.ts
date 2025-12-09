import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interfaz para la respuesta estandarizada
 */
export interface Response<T> {
    success: boolean;
    data: T;
    message: string;
}

/**
 * Interceptor que transforma todas las respuestas a un formato estándar
 * Formato: { success: boolean, data: any, message: string }
 */
@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
                data: data,
                message: 'Operación exitosa',
            })),
        );
    }
}
