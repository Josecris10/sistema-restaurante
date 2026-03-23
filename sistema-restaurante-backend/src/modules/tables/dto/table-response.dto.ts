import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TableStatus } from '../enums/table-status.enum';

export class TableResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5, description: 'Número físico de la mesa' })
  number: number;

  @ApiProperty({ example: 'INSIDE' })
  ubication: string;

  @ApiProperty({ example: 'OCCUPIED' })
  @IsEnum(TableStatus)
  state: TableStatus;
}
