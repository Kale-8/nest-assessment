import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { TechniciansModule } from './technicians/technicians.module';
import { TicketsModule } from './tickets/tickets.module';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Client } from './clients/entities/client.entity';
import { Technician } from './technicians/entities/technician.entity';
import { Ticket } from './tickets/entities/ticket.entity';

@Module({
    imports: [
        // Configuración de variables de entorno
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Configuración de TypeORM con PostgreSQL
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            schema: process.env.DB_SCHEMA || 'public',
            entities: [User, Category, Client, Technician, Ticket],
            synchronize: true, // Solo para desarrollo, en producción usar migraciones
            logging: false,
            ssl: {
                rejectUnauthorized: false, // Necesario para Supabase
            },
        }),

        // Módulos de la aplicación
        AuthModule,
        UsersModule,
        CategoriesModule,
        ClientsModule,
        TechniciansModule,
        TicketsModule,
    ],
    providers: [
        // Interceptor global para formatear respuestas
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule { }
