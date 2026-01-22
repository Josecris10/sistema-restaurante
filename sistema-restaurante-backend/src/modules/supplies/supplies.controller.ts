import { Controller } from '@nestjs/common';
import { SuppliesService } from './supplies.service';

@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}
}
