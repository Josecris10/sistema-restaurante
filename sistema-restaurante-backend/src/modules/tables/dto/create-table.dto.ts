import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { TableUbication } from '../enums/table-ubication.enum';

export class CreateTableDto {
  @ApiProperty({ example: 1, description: 'Número de mesa' })
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @ApiProperty({
    example: 'INSIDE',
    description: 'Indica si la mesa se encuentra adentro o afuera',
  })
  @IsEnum(TableUbication)
  ubication: TableUbication;
}
