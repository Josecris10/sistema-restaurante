import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ItemDetailDto } from './item-detail.dto';

export class CreateOrderDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  tableId: number;

  @ApiProperty({ example: 'Rodrigo Pérez' })
  @IsString()
  @IsOptional()
  clientName: string;

  @ApiProperty({ example: 'Garzón Apellido' })
  @IsNumber()
  waiterId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDetailDto)
  itemDetails: ItemDetailDto[];
}
