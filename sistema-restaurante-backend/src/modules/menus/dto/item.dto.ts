import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsEither } from 'src/common/decorators/is-either.decorator';

export class ItemDto {
  @ApiProperty({ example: 'Coca cola zero 550CC' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1000 })
  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  supplyId?: number;

  @IsOptional()
  @IsNumber()
  recipeId?: number;
}
