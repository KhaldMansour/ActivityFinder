import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity } from '../entities/activity.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';

describe('ActivityService', () => {
  let service: ActivityService;
  let activityRepository: Repository<Activity>;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getRepositoryToken(Activity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
    activityRepository = module.get<Repository<Activity>>(getRepositoryToken(Activity));

    user = new User();
    user.id = 1;
  });

  describe('create', () => {
    it('should create an activity', async () => {
      const createActivityDto = new CreateActivityDto();
      createActivityDto.title = 'Activity 1';
      createActivityDto.price = 10.25;

      const savedActivity = new Activity();
      savedActivity.id = 1;
      savedActivity.title = createActivityDto.title;
      savedActivity.price = createActivityDto.price;
      savedActivity.supplier = user;

      jest.spyOn(activityRepository, 'create').mockReturnValue(savedActivity);
      jest.spyOn(activityRepository, 'save').mockResolvedValue(savedActivity);

      const result = await service.create(user, createActivityDto);
      
      expect(result).toEqual(savedActivity);
      expect(activityRepository.create).toHaveBeenCalledWith({
        ...createActivityDto,
        supplier: user,
      });
      expect(activityRepository.save).toHaveBeenCalledWith(savedActivity);
    });
  });

  describe('findAll', () => {
    it('should return all activities', async () => {
      const activities = [new Activity(), new Activity()];
      jest.spyOn(activityRepository, 'find').mockResolvedValue(activities);

      const result = await service.findAll();

      expect(result).toEqual(activities);
      expect(activityRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an activity by id', async () => {
      const activity = new Activity();
      activity.id = 1;
      activity.supplier = user;

      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(activity);

      const result = await service.findOne(1);

      expect(result).toEqual(activity);
      expect(activityRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['supplier'],
      });
    });

    it('should throw NotFoundException if activity is not found', async () => {
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the activity if authorized', async () => {
      const existingActivity = new Activity();
      existingActivity.id = 1;
      existingActivity.supplier = user;

      const updateDto = new UpdateActivityDto();
      updateDto.title = 'Updated Activity';

      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(existingActivity);
      jest.spyOn(activityRepository, 'save').mockResolvedValue(existingActivity);

      const result = await service.update(1, updateDto, user);

      expect(result.title).toBe('Updated Activity');
      expect(activityRepository.save).toHaveBeenCalledWith(existingActivity);
    });

    it('should throw NotFoundException if activity is not found', async () => {
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, new UpdateActivityDto(), user)).rejects.toThrowError(NotFoundException);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const activity = new Activity();
      activity.id = 1;
      activity.supplier = new User();
      activity.supplier.id = 2;

      const updateDto = new UpdateActivityDto();
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(activity);

      await expect(service.update(1, updateDto, user)).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove an activity if authorized', async () => {
      const activity = new Activity();
      activity.id = 1;
      activity.supplier = user;

      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(activity);
      jest.spyOn(activityRepository, 'remove').mockResolvedValue(activity);

      const result = await service.remove(1, user);

      expect(result).toEqual(activity);
      expect(activityRepository.remove).toHaveBeenCalledWith(activity);
    });

    it('should throw NotFoundException if activity is not found', async () => {
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1, user)).rejects.toThrowError(NotFoundException);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const activity = new Activity();
      activity.id = 1;
      activity.supplier = new User();
      activity.supplier.id = 2;

      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(activity);

      await expect(service.remove(1, user)).rejects.toThrowError(ForbiddenException);
    });
  });
});
