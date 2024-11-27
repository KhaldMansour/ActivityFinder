import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

import { Activity } from 'src/activity/entities/activity.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  @Exclude()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  @Exclude()
  isAdmin: boolean;

  @OneToMany(() => Activity, (activity) => activity.supplier)
  activities: Activity[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
