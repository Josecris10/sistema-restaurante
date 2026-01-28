import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T[];
  total: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res) => {
        if (res && typeof res === 'object' && 'data' in res && 'total' in res) {
          return res;
        }

        return {
          total: Array.isArray(res) ? res.length : res ? 1 : undefined,
          data: res,
        };
      }),
    );
  }
}
