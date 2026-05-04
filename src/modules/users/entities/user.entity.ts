import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Place } from '../../places/entities/place.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum UserRole {
  USER  = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;       // ⚠️ lưu bcrypt hash, KHÔNG lưu plain text

  @Column({ name: 'full_name', length: 100 })
  fullName!: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @OneToMany(() => Place, (place) => place.createdBy)
  places!: Place[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}