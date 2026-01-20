import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Restaurante Backend: Sistema en línea y conectado a la base de datos';
  }
}
