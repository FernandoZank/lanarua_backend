import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  password: string;

  @Column({ length: 1, default: 'P' })
  user_type: string;

  @Column()
  birthday: Date;

  @Column()
  avatar: string;

  @Column()
  email_verification: boolean;

  @Column()
  address: string;

  @Column()
  address_number: number;

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
}

export default User;
