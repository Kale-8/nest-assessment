import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Filtro global para manejar excepciones HTTP
 * Formatea los errores en el mismo estándar que las respuestas exitosas
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const message =
            typeof exceptionResponse === 'string'
                ? exceptionResponse
                : (exceptionResponse as any).message || 'Error en la solicitud';

        response.status(status).json({
            success: false,
            data: null,
            message: Array.isArray(message) ? message.join(', ') : message,
        });
    }
}
