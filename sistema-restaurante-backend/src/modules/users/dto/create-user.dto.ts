import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juanito',
    description: 'Nombre de pila del usuario',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Primer apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '1234567-4',
    description: 'Rut o pasaporte del usuario',
  })
  @IsString()
  @IsOptional()
  rut?: string;

  @ApiProperty({
    example: 'admin@restaurante.com',
    description: 'Correo del usuario',
  })
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'abc123', description: 'Contraseña de acceso' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ example: 'ADMIN', description: 'Tipo de usuario' })
  @IsEnum(UserRole, { message: 'El rol no es válido' })
  @IsOptional()
  role?: UserRole;
}
