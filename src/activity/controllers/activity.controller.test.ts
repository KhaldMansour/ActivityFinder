import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { faker } from '@faker-js/faker/.';
import { Repository } from 'typeorm';

import { UsersModule } from 'src/users/users.module';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { UsersService } from 'src/users/services/users.service';

import { ActivityModule } from '../activity.module';
import { Activity } from '../entities/activity.entity';
import { ActivityService } from '../services/activity.service';

import { ActivityController } from './activity.controller';

describe('ActivityController (Integration)', () => {
  let app: INestApplication;
  let activityService: ActivityService;
  let userService: UsersService;
  let authService: AuthService;
  let activityRepository: Repository<Activity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Activity],
          dropSchema: true,
          synchronize: true
        }),
        ActivityModule,
        UsersModule, //hemdan
        AppModule,
        ConfigModule.forRoot({ isGlobal: true })
      ],
      controllers: [ActivityController],
      providers: [ActivityService]
    }).compile();

    app = module.createNestApplication();

    await app.init();

    activityService = module.get<ActivityService>(ActivityService);
    activityRepository = app.get('ActivityRepository');
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /activities', () => {
    it('should return a list of activities', async () => {
      const activityData = [
        { title: 'Activity 1', price: 10.0 },
        { title: 'Activity 2', price: 15.0 }
      ];
      await activityRepository.save(activityData);
      const { token } = await createTestUserAndLogin(true);

      const response = await request(app.getHttpServer())
        .get('/activities')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe(activityData[0].title);
      expect(response.body.data[1].price).toBe(activityData[1].price);
    });
  });

  describe('POST /activities', () => {
    it('should create an activity', async () => {
      const { token, user } = await createTestUserAndLogin(true);
      const createActivityDto = {
        title: faker.lorem.word(),
        price: faker.finance.amount()
      };

      const response = await request(app.getHttpServer())
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send(createActivityDto);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(createActivityDto.title);
      expect(response.body.data.price).toBe(createActivityDto.price);
      expect(response.body.data.supplier.id).toBe(user.id);
    });
  });

  describe('GET /activities/:id', () => {
    it('should return a single activity', async () => {
      const activity = await activityRepository.save({
        title: faker.lorem.word(),
        price: faker.number.float({ min: 1, max: 100 })
      });
      const { token } = await createTestUserAndLogin(true);

      const response = await request(app.getHttpServer())
        .get(`/activities/${activity.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(activity.id);
      expect(response.body.data.title).toBe(activity.title);
    });
  });

  describe('PUT /activities/:id', () => {
    it('should update an activity', async () => {
      const { token , user } = await createTestUserAndLogin(true);
      const activity = await activityRepository.save({
        title: faker.lorem.word(),
        price: faker.number.float({ min: 1, max: 100 }),
        supplier: user
      });
      const updateData = {
        title: faker.lorem.word(),
        price: faker.number.float({ min: 1, max: 100 })
      };        

      const response = await request(app.getHttpServer())
        .put(`/activities/${activity.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.price).toBe(updateData.price);
    });
  });

  describe('DELETE /activities/:id', () => {
    it('should delete an activity', async () => {
      const { token , user } = await createTestUserAndLogin(true);
      const activity = await activityRepository.save({
        title: faker.lorem.word(),
        price: faker.number.float({ min: 1, max: 100 }),
        supplier: user
      });

      const response = await request(app.getHttpServer())
        .delete(`/activities/${activity.id}`)
        .set('Authorization', `Bearer ${token}`);          

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(activity.title);
      await expect(activityService.findOne(activity.id)).rejects.toThrowError(
        new Error('Activity not found')
      );
    });
  });

  async function createTestUserAndLogin(isAdmin: boolean): Promise<{ user: User; token: string }>{
    const password = faker.internet.password();
    const user = await userService.create({
      email: faker.internet.email(),
      password,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      isAdmin: isAdmin
    });

    const logindto = {
      email: user.email,
      password
    };

    const token = (await authService.login(logindto)).access_token;

    return { user, token };
  }
});
