import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Place } from '../../places/entities/place.entity';
import { User }  from '../../users/entities/user.entity';

@Entity('place_images')
export class PlaceImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  url!: string;

  @ManyToOne(() => Place, (place) => place.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}