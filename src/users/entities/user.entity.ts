import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn  } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
      id: number;
  
    @Column({nullable: true})
      firstName: string;
  
    @Column({nullable: true})
      lastName: string;

    @Column({unique : true})
      email: string;

    @Column()
      password: string;
  
    @Column({ default: false })
      isAdmin: boolean;

    @BeforeInsert()
    async hashPassword() {
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    }
}
