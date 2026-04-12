import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('El usuario ya existe');
    }

    try {
      const { password, ...userData } = createUserDto;

      const newUser = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const user = await this.userRepository.save(newUser);
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Error al crear usuario',
      });
    }
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
      },
    });
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: { id: true },
    });
  }

  async findWaiterById(id: number): Promise<User> {
    const waiter = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .andWhere('user.isActive = true')
      .andWhere('user.role IN (:...roles)', {
        roles: [UserRole.WAITER, UserRole.ADMIN],
      })
      .getOne();

    if (!waiter)
      throw new NotFoundException(
        `El usuario con ID #${id} no es un garzón autorizado o no existe`,
      );

    return waiter;
  }
}
