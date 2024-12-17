import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Activity } from './entities/activity.entity';
import { ActivityController } from './controllers/activity.controller';
import { ActivityService } from './services/activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [TypeOrmModule]
})
export class ActivityModule {}
