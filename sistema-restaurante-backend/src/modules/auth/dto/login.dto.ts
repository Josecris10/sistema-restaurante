import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@restaurante.com',
    description: 'Correo del usuario',
  })
  @IsEmail({}, { message: 'Formato de email inválido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'abc123',
    description: 'Contraseña de acceso del usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
