import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
  UpdateDateColumn, Unique,
} from 'typeorm';
import { Place } from '../../places/entities/place.entity';
import { User }  from '../../users/entities/user.entity';

@Entity('reviews')
@Unique(['place', 'user'])   // mỗi user chỉ review 1 lần
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'smallint' })
  rating!: number;             // CHECK 1–5 validate ở Service layer

  @Column({ nullable: true, type: 'text' })
  comment!: string;

  @Column({ name: 'is_anonymous', default: false })
  isAnonymous!: boolean;

  @ManyToOne(() => Place, (place) => place.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}