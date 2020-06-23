import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

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
    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${
          this.avatar ? this.avatar : 'default.png'
        }`;
      case 's3':
        return `https://lanarua.s3-sa-east-1.amazonaws.com/users/${
          this.avatar ? this.avatar : 'default.png'
        }`;
      default:
        return `https://${uploadConfig.config.aws.bucket}.s3-sa-east-1.amazonaws.com/users/default.png`;
    }
  }
}

export default User;
