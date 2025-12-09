import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Configuración global de validación
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Elimina propiedades no definidas en el DTO
            forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
            transform: true, // Transforma los payloads a instancias de DTO
        }),
    );

    // Configuración de CORS
    app.enableCors();

    // Configuración de Swagger
    const config = new DocumentBuilder()
        .setTitle('TechHelpDesk API')
        .setDescription(
            'Sistema de Soporte Técnico - API REST para gestión de tickets de soporte\n\n' +
            'Desarrollador: Kaled Mesa\n' +
            'Clan: Linus',
        )
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Ingrese su token JWT',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('Auth', 'Endpoints de autenticación')
        .addTag('Users', 'Gestión de usuarios')
        .addTag('Categories', 'Gestión de categorías')
        .addTag('Clients', 'Gestión de clientes')
        .addTag('Technicians', 'Gestión de técnicos')
        .addTag('Tickets', 'Gestión de tickets de soporte')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`\n🚀 TechHelpDesk API está corriendo en: http://localhost:${port}`);
    console.log(`📚 Documentación Swagger: http://localhost:${port}/api\n`);
}

bootstrap();
