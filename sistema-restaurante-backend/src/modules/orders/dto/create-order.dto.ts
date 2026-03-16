import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  tableId: number;

  @ApiProperty({ example: 'Rodrigo Pérez' })
  @IsString()
  @IsOptional()
  clientName: number;
}
