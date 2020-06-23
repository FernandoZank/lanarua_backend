import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ length: 1, default: 'P' })
  user_type: string;

  @Column()
  birthday: Date;

  @Column()
  avatar: string;

  @Column()
  phone: string;

  @Column()
  mobile: string;

  @Column()
  email_verification: boolean;

  @Column()
  address: string;

  @Column()
  address_number: string;

  @Column()
  aditional_info: string;

  @Column()
  city: string;

  @Column()
  cap: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarURL(): string | null {
    return `${process.env.APP_API_URL}/files/${
      this.avatar ? this.avatar : 'default.png'
    }`;
  }
}

export default User;
