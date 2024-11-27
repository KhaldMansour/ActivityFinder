import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth } from '@nestjs/swagger';

import { User } from 'src/users/entities/user.entity';

import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Controller('activities')
@ApiBearerAuth('JWT')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @Request() request: ExpressRequest,
  ): Promise<Activity> {
    const user = request.user;
    return await this.activityService.create(
      plainToInstance(User, user),
      createActivityDto,
    ); // Hemdan
  }

  @Get()
  async findAll(): Promise<Activity[]> {
    return await this.activityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Activity> {
    return await this.activityService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @Request() request: ExpressRequest,
  ): Promise<Activity> {
    const user = request.user;
    return await this.activityService.update(+id, updateActivityDto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() request: ExpressRequest,
  ): Promise<Activity> {
    const user = request.user;
    return await this.activityService.remove(+id, user);
  }
}
