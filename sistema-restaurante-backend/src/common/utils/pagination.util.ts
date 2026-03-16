// paginate.util.ts (Versión Pro)
import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';

export async function paginate<T extends ObjectLiteral>(
  target: Repository<T> | SelectQueryBuilder<T>, // <--- Acepta ambos!
  paginationDto: PaginationDto,
  options: any = {},
) {
  const { page = 1, limit = 10 } = paginationDto;
  const skip = (page - 1) * limit;

  // QueryBuilder
  if (target instanceof SelectQueryBuilder) {
    const total = await target.getCount();
    const data = await target.offset(skip).limit(limit).getRawMany();
    return { data, total };
  }

  // Repositorio (Consultas normales)
  const [data, total] = await target.findAndCount({
    ...options,
    skip,
    take: limit,
  });

  return { data, total };
}
