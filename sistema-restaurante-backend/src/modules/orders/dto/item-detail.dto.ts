import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ItemDetailDto {
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
  @IsNotEmpty()
  itemId: number;
}
