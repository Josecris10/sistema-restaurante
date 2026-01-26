// tables/dto/table-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class TableResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5, description: 'Número físico de la mesa' })
  number: number;

  @ApiProperty({ example: 'INSIDE' })
  ubication: string;
}
