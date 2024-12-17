import { Test, TestingModule } from '@nestjs/testing';

import { ActivityService } from '../services/activity.service';

import { ActivityController } from './activity.controller';

describe('ActivityController', () => {
  let controller: ActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [ActivityService]
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
