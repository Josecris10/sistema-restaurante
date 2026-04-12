import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class GetRecipesFilterDto extends PaginationDto {
  @ApiProperty({
    description: 'Buscar por nombre de la receta (coincidencia parcial)',
    required: false,
    example: 'Carne a la cacerola',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filtrar por ingrediente',
    required: false,
    example: 'Carne de vacuno',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ingredientId?: number;
}
