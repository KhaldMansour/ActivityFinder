import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker/.';

import { ActivityService } from '../services/activity.service';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { Activity } from '../entities/activity.entity';

import { ActivityController } from './activity.controller';

describe('ActivityController', () => {
  let controller: ActivityController;
  let service: ActivityService;

  const mockActivityService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockActivityService
        }
      ]
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
    service = module.get<ActivityService>(ActivityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new activity', async () => {
      const title = faker.lorem.word();
      const price = faker.number.float({ min: 1, max: 100 });
      const rating = faker.number.float({ min: 0, max: 5 });
      const createActivityDto: CreateActivityDto = {
        title,
        price,
        rating
      };
      const mockActivity = new Activity();
      mockActivity.id = 1;
      mockActivity.title = title;
      mockActivity.price = price;
      mockActivity.supplier = { id: 1 } as any;
      mockActivityService.create.mockResolvedValue(mockActivity);
      const request = { user: { id: 1 } };

      const result = await controller.create(createActivityDto, request as any);

      expect(result).toEqual(mockActivity);
      expect(mockActivityService.create).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        createActivityDto
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of activities', async () => {
      const mockActivities = [
        {
          id: 1,
          title: faker.lorem.word(),
          price: faker.number.float({ min: 1, max: 100 })
        },
        {
          id: 2,
          title: faker.lorem.word(),
          price: faker.number.float({ min: 1, max: 100 })
        }
      ];
      mockActivityService.findAll.mockResolvedValue(mockActivities);

      const result = await controller.findAll();

      expect(result).toEqual(mockActivities);
      expect(mockActivityService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single activity', async () => {
      const mockActivity = {
        id: 1,
        title: faker.lorem.word(),
        price: faker.number.float({ min: 1, max: 100 })
      };
      mockActivityService.findOne.mockResolvedValue(mockActivity);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockActivity);
      expect(mockActivityService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if activity not found', async () => {
      mockActivityService.findOne.mockRejectedValue(new NotFoundException('Activity not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an activity', async () => {
      const title = faker.lorem.word();
      const price = faker.number.float({ min: 1, max: 100 });
      const rating = faker.number.float({ min: 0, max: 5 });
      const updateActivityDto: UpdateActivityDto = {
        title,
        price,
        rating
      };
      const mockUpdatedActivity = {
        id: 1,
        title,
        price,
        hasOffers: faker.datatype.boolean()
      };
      mockActivityService.update.mockResolvedValue(mockUpdatedActivity);
      const request = { user: { id: 1 } };

      const result = await controller.update(
        '1',
        updateActivityDto,
        request as any
      );

      expect(result).toEqual(mockUpdatedActivity);
      expect(mockActivityService.update).toHaveBeenCalledWith(
        1,
        updateActivityDto,
        expect.objectContaining({ id: 1 })
      );
    });
  });

  describe('remove', () => {
    it('should remove an activity', async () => {
      const mockActivity = {
        id: 1,
        title: faker.lorem.word(),
        price: faker.number.float({ min: 1, max: 100 })
      };
      mockActivityService.remove.mockResolvedValue(mockActivity);
      const request = { user: { id: 1 } };
      const result = await controller.remove('1', request as any);

      expect(result).toEqual(mockActivity);
      expect(mockActivityService.remove).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ id: 1 })
      );
    });
  });
});
