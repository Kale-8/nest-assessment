import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Client } from '../../clients/entities/client.entity';
import { Technician } from '../../technicians/entities/technician.entity';
import { Ticket, TicketStatus, TicketPriority } from '../../tickets/entities/ticket.entity';

/**
 * Script para poblar la base de datos con datos iniciales
 * Ejecutar con: npm run seed
 */
async function seed() {
    // Configurar conexión a la base de datos
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        schema: process.env.DB_SCHEMA || 'public',
        entities: [User, Category, Client, Technician, Ticket],
        synchronize: true,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        await dataSource.initialize();
        console.log('✅ Conexión a la base de datos establecida');

        // Limpiar base de datos
        console.log('🗑️ Limpiando base de datos...');
        await dataSource.synchronize(true);
        console.log('✅ Base de datos limpiada');

        // 1. Crear usuarios
        console.log('👤 Creando usuarios...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUser = await dataSource.getRepository(User).save({
            name: 'Administrador Principal',
            email: 'admin@techhelpdesk.com',
            password: hashedPassword,
            role: UserRole.ADMIN,
        });

        const techUser = await dataSource.getRepository(User).save({
            name: 'Usuario Técnico',
            email: 'tech@techhelpdesk.com',
            password: hashedPassword,
            role: UserRole.TECHNICIAN,
        });

        const clientUser = await dataSource.getRepository(User).save({
            name: 'Usuario Cliente',
            email: 'client@techhelpdesk.com',
            password: hashedPassword,
            role: UserRole.CLIENT,
        });

        console.log('✅ Usuarios creados');

        // 2. Crear categorías
        console.log('📁 Creando categorías...');
        const categories = await dataSource.getRepository(Category).save([
            {
                name: 'Solicitud',
                description: 'Solicitudes generales de soporte y consultas',
            },
            {
                name: 'Incidente de Hardware',
                description: 'Problemas relacionados con hardware de computadoras y periféricos',
            },
            {
                name: 'Incidente de Software',
                description: 'Problemas relacionados con software, aplicaciones y sistemas operativos',
            },
        ]);
        console.log('✅ Categorías creadas');

        // 3. Crear clientes
        console.log('👥 Creando clientes...');
        const clients = await dataSource.getRepository(Client).save([
            {
                name: 'Carlos Rodríguez',
                company: 'Tech Solutions S.A.',
                contactEmail: 'carlos.rodriguez@techsolutions.com',
            },
            {
                name: 'María González',
                company: 'Innovatech Corp',
                contactEmail: 'maria.gonzalez@innovatech.com',
            },
            {
                name: 'Juan Pérez',
                company: 'Digital Services Ltd',
                contactEmail: 'juan.perez@digitalservices.com',
            },
            {
                name: 'Ana Martínez',
                company: 'Cloud Systems Inc',
                contactEmail: 'ana.martinez@cloudsystems.com',
            },
            {
                name: 'Luis Fernández',
                company: 'Data Analytics Co',
                contactEmail: 'luis.fernandez@dataanalytics.com',
            },
        ]);
        console.log('✅ Clientes creados');

        // 4. Crear técnicos
        console.log('🔧 Creando técnicos...');
        const technicians = await dataSource.getRepository(Technician).save([
            {
                name: 'Pedro Sánchez',
                specialty: 'Hardware y Redes',
                availability: true,
            },
            {
                name: 'Laura Torres',
                specialty: 'Software y Aplicaciones',
                availability: true,
            },
            {
                name: 'Miguel Ángel Ruiz',
                specialty: 'Sistemas Operativos',
                availability: true,
            },
        ]);
        console.log('✅ Técnicos creados');

        // 5. Crear tickets de ejemplo
        console.log('🎫 Creando tickets de ejemplo...');
        await dataSource.getRepository(Ticket).save([
            {
                title: 'Computadora no enciende',
                description: 'La computadora del área de ventas no enciende desde esta mañana',
                status: TicketStatus.OPEN,
                priority: TicketPriority.HIGH,
                categoryId: categories[1].id,
                clientId: clients[0].id,
                technicianId: technicians[0].id,
                createdById: adminUser.id,
            },
            {
                title: 'Error al instalar software',
                description: 'No puedo instalar el nuevo software de contabilidad',
                status: TicketStatus.IN_PROGRESS,
                priority: TicketPriority.MEDIUM,
                categoryId: categories[2].id,
                clientId: clients[1].id,
                technicianId: technicians[1].id,
                createdById: clientUser.id,
            },
            {
                title: 'Solicitud de acceso a carpeta compartida',
                description: 'Necesito acceso a la carpeta compartida de proyectos',
                status: TicketStatus.RESOLVED,
                priority: TicketPriority.LOW,
                categoryId: categories[0].id,
                clientId: clients[2].id,
                technicianId: technicians[2].id,
                createdById: clientUser.id,
            },
            {
                title: 'Impresora no imprime',
                description: 'La impresora del piso 3 no responde',
                status: TicketStatus.OPEN,
                priority: TicketPriority.MEDIUM,
                categoryId: categories[1].id,
                clientId: clients[3].id,
                createdById: adminUser.id,
            },
            {
                title: 'Pantalla azul en Windows',
                description: 'Mi computadora muestra pantalla azul al iniciar',
                status: TicketStatus.IN_PROGRESS,
                priority: TicketPriority.CRITICAL,
                categoryId: categories[2].id,
                clientId: clients[4].id,
                technicianId: technicians[2].id,
                createdById: clientUser.id,
            },
            {
                title: 'Solicitud de nuevo usuario',
                description: 'Necesito crear un usuario para el nuevo empleado',
                status: TicketStatus.CLOSED,
                priority: TicketPriority.LOW,
                categoryId: categories[0].id,
                clientId: clients[0].id,
                technicianId: technicians[1].id,
                createdById: adminUser.id,
            },
            {
                title: 'Teclado no funciona',
                description: 'Algunas teclas del teclado no responden',
                status: TicketStatus.OPEN,
                priority: TicketPriority.MEDIUM,
                categoryId: categories[1].id,
                clientId: clients[1].id,
                createdById: clientUser.id,
            },
            {
                title: 'Actualización de antivirus',
                description: 'Necesito actualizar el antivirus corporativo',
                status: TicketStatus.RESOLVED,
                priority: TicketPriority.HIGH,
                categoryId: categories[2].id,
                clientId: clients[2].id,
                technicianId: technicians[1].id,
                createdById: adminUser.id,
            },
            {
                title: 'Conexión a internet lenta',
                description: 'La conexión a internet está muy lenta en mi área',
                status: TicketStatus.IN_PROGRESS,
                priority: TicketPriority.MEDIUM,
                categoryId: categories[1].id,
                clientId: clients[3].id,
                technicianId: technicians[0].id,
                createdById: clientUser.id,
            },
            {
                title: 'Solicitud de licencia de software',
                description: 'Necesito una licencia de Adobe Photoshop',
                status: TicketStatus.OPEN,
                priority: TicketPriority.LOW,
                categoryId: categories[0].id,
                clientId: clients[4].id,
                createdById: clientUser.id,
            },
        ]);
        console.log('✅ Tickets creados');

        console.log('\n🎉 ¡Seeder completado exitosamente!');
        console.log('\n📊 Resumen de datos creados:');
        console.log(`   - Usuarios: 3 (1 Admin, 1 Técnico, 1 Cliente)`);
        console.log(`   - Categorías: 3`);
        console.log(`   - Clientes: 5`);
        console.log(`   - Técnicos: 3`);
        console.log(`   - Tickets: 10`);
        console.log('\n🔑 Credenciales de acceso:');
        console.log('   Admin: admin@techhelpdesk.com / admin123');
        console.log('   Técnico: tech@techhelpdesk.com / admin123');
        console.log('   Cliente: client@techhelpdesk.com / admin123');

        await dataSource.destroy();
    } catch (error) {
        console.error('❌ Error al ejecutar el seeder:', error);
        process.exit(1);
    }
}

// Ejecutar el seeder
seed();
