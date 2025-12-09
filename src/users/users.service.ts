import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Servicio de usuarios
 * Maneja la lógica de negocio para CRUD de usuarios
 */
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    /**
     * Crear un nuevo usuario
     */
    async create(createUserDto: CreateUserDto) {
        // Verificar si el email ya existe
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // Crear el usuario
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const savedUser = await this.usersRepository.save(user);

        // Retornar sin contraseña
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }

    /**
     * Obtener todos los usuarios
     */
    async findAll() {
        const users = await this.usersRepository.find();
        // Remover contraseñas de todos los usuarios
        return users.map(({ password, ...user }) => user);
    }

    /**
     * Obtener un usuario por ID
     */
    async findOne(id: string) {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Actualizar un usuario
     */
    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        // Si se actualiza el email, verificar que no exista
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateUserDto.email },
            });

            if (existingUser) {
                throw new ConflictException('El email ya está registrado');
            }
        }

        // Si se actualiza la contraseña, hashearla
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        // Actualizar
        await this.usersRepository.update(id, updateUserDto);

        // Retornar usuario actualizado sin contraseña
        const updatedUser = await this.usersRepository.findOne({ where: { id } });
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    /**
     * Eliminar un usuario
     */
    async remove(id: string) {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        await this.usersRepository.remove(user);
        return { message: 'Usuario eliminado exitosamente' };
    }
}
