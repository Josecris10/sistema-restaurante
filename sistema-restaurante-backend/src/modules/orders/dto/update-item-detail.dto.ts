import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateItemDetailDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  newQuantity: number;
}
