import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ItemDetailDto {
  @ApiProperty({ example: 'Coca cola zero 550CC' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @IsOptional()
  actualPrice?: number;

  @ApiProperty({ example: 'no tan helada' })
  @IsString()
  @IsOptional()
  detail?: string;

  @IsNumber()
  @IsOptional()
  itemId?: number;
}
