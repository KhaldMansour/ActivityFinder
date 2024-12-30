import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Put
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { plainToInstance } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse
} from '@nestjs/swagger';

import { User } from 'src/users/entities/user.entity';

import { ActivityService } from '../services/activity.service';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { Activity } from '../entities/activity.entity';
import { UpdateActivityDto } from '../dto/update-activity.dto';

@Controller('activities')
@ApiBearerAuth('JWT')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create an activity' })
  @ApiBody({ type: CreateActivityDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the activity',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Request was successful' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'relation' },
            price: { type: 'number', example: 152 },
            rating: { type: 'number', example: 5 },
            hasOffer: { type: 'boolean', example: false },
            supplier: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                firstName: { type: 'string', example: 'Khaled' },
                lastName: { type: 'string', example: 'Mansour' },
                email: { type: 'string', example: 'wtewshtw@hjgmail.com' }
              }
            }
          }
        },
        error: { type: 'string', nullable: true }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'An error occurred' })
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @Request() request: ExpressRequest
  ): Promise<Activity> {
    const user = request.user;

    return await this.activityService.create(
      plainToInstance(User, user),
      createActivityDto
    ); // Hemdan
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all activities' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched all activities',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request was successful' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'relation' },
              price: { type: 'number', example: 152 },
              rating: { type: 'number', example: 5 },
              hasOffer: { type: 'boolean', example: false },
              supplier: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  firstName: { type: 'string', example: 'Khaled' },
                  lastName: { type: 'string', example: 'Mansour' },
                  email: { type: 'string', example: 'wtewshtw@hjgmail.com' }
                }
              }
            }
          }
        },
        error: { type: 'string', nullable: true }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'An error occurred' })
  async findAll(): Promise<Activity[]> {
    return await this.activityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single activity by ID' })
  @ApiParam({ name: 'id', description: 'ID of the activity to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the activity',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request was successful' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'relation' },
            price: { type: 'number', example: 152 },
            rating: { type: 'number', example: 5 },
            hasOffer: { type: 'boolean', example: false },
            supplier: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                firstName: { type: 'string', example: 'Khaled' },
                lastName: { type: 'string', example: 'Mansour' },
                email: { type: 'string', example: 'wtewshtw@hjgmail.com' }
              }
            }
          }
        },
        error: { type: 'string', nullable: true }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'An error occurred' })

  async findOne(@Param('id') id: string): Promise<Activity> {
    return await this.activityService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an activity by ID' })
  @ApiParam({ name: 'id', description: 'ID of the activity to update' })
  @ApiBody({ type: UpdateActivityDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the activity',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request was successful' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'relation' },
            price: { type: 'number', example: 152 },
            rating: { type: 'number', example: 5 },
            hasOffer: { type: 'boolean', example: false },
            supplier: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                firstName: { type: 'string', example: 'Khaled' },
                lastName: { type: 'string', example: 'Mansour' },
                email: { type: 'string', example: 'wtewshtw@hjgmail.com' }
              }
            }
          }
        },
        error: { type: 'string', nullable: true }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'An error occurred' })
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @Request() request: ExpressRequest
  ): Promise<Activity> {
    const user = request.user;
    return await this.activityService.update(+id, updateActivityDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity by ID' })
  @ApiParam({ name: 'id', description: 'ID of the activity to delete' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the activity',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request was successful' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'relation' },
            price: { type: 'number', example: 152 },
            rating: { type: 'number', example: 5 },
            hasOffer: { type: 'boolean', example: false },
            supplier: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                firstName: { type: 'string', example: 'Khaled' },
                lastName: { type: 'string', example: 'Mansour' },
                email: { type: 'string', example: 'wtewshtw@hjgmail.com' }
              }
            }
          }
        },
        error: { type: 'string', nullable: true }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'An error occurred' })
  async remove(
    @Param('id') id: string,
    @Request() request: ExpressRequest
  ): Promise<Activity> {
    const user = request.user;
    return await this.activityService.remove(+id, user);
  }
}
