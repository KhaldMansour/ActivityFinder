import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { User } from 'src/users/entities/user.entity';

import { Activity } from './entities/activity.entity';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(@InjectRepository(Activity) private readonly activityRepository: Repository<Activity>){}

  async create(user: User , createActivityDto: CreateActivityDto): Promise <Activity> {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      supplier: user
    });

    return await this.activityRepository.save(activity);
  }

  async findAll(): Promise <Activity[]> {
    const activities = await this.activityRepository.find({
      relations: ['supplier']
    });
  
    return plainToInstance(Activity, activities);
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['supplier'] 
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
  
    return plainToInstance(Activity, activity, { excludeExtraneousValues: true });
  }

  async update(id: number, updateActivityDto: UpdateActivityDto , user: User): Promise <Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['supplier']
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (activity.supplier.id !== user.id && !user.isAdmin) {
      throw new ForbiddenException('You are not authorized to update this activity');
    }

    Object.assign(activity, updateActivityDto);
    
    return await this.activityRepository.save(activity);
  }

  async remove(id: number , user: User): Promise <Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['supplier']
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (activity.supplier.id !== user.id && !user.isAdmin) {
      throw new ForbiddenException('You are not authorized to update this activity');
    }

    return await this.activityRepository.remove(activity);
  }
}
