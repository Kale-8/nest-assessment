import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Servicio de autenticación
 * Maneja el registro, login y generación de tokens JWT
 */
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    /**
     * Registra un nuevo usuario
     * Hash de la contraseña con bcrypt
     */
    async register(registerDto: RegisterDto) {
        // Verificar si el email ya existe
        const existingUser = await this.usersRepository.findOne({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Crear el usuario
        const user = this.usersRepository.create({
            ...registerDto,
            password: hashedPassword,
        });

        await this.usersRepository.save(user);

        // Generar token JWT
        const token = this.generateToken(user);

        // Retornar usuario sin contraseña
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            access_token: token,
        };
    }

    /**
     * Autentica un usuario y genera un token JWT
     */
    async login(loginDto: LoginDto) {
        // Buscar usuario por email
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generar token JWT
        const token = this.generateToken(user);

        // Retornar usuario sin contraseña
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            access_token: token,
        };
    }

    /**
     * Genera un token JWT para el usuario
     */
    private generateToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return this.jwtService.sign(payload);
    }
}
