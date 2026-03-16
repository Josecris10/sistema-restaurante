import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({ description: 'Datos de la respuesta' })
  data: T | T[];

  @ApiProperty({
    description: 'Total real en base de datos (solo para listas paginadas)',
    required: false,
  })
  total?: number;
}
