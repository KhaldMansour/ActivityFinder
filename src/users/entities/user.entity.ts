import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn , Unique, ManyToMany, JoinTable } from 'typeorm';

const bcrypt = require("bcrypt");

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
            this.password = await bcrypt.hash(this.password);
        }
    }
}
