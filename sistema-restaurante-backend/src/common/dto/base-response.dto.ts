import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({
    description: 'Total de registros encontrados',
    example: 2,
  })
  total: number;
  data: T | T[];
}
