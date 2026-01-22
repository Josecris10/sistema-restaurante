import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';

import { Supply } from './entities/supply.entity';
import { SupplyBatch } from './entities/supply-batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supply, SupplyBatch])],
  controllers: [SuppliesController],
  providers: [SuppliesService],
  exports: [SuppliesService],
})
export class SuppliesModule {}
