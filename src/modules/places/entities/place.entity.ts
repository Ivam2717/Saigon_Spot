import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, ManyToMany, JoinTable,
  CreateDateColumn, UpdateDateColumn, JoinColumn,
} from 'typeorm';
import { User }        from '../../users/entities/user.entity';
import { Category }    from '../../categories/entities/category.entity';
import { Tag }         from '../../tags/entities/tag.entity';
import { Review }      from '../../reviews/entities/review.entity';
import { PlaceImage }  from '../../place-images/entities/place-image.entity';

export enum PlaceStatus {
  PENDING  = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Type helper cho PostGIS GeoJSON Point
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

@Entity('places')
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true, length: 255 })
  slug!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string;

  @Column({ length: 255 })
  address!: string;

  @Column({ length: 100 })
  district!: string;

  // ✅ PostGIS GEOGRAPHY – lưu dạng GeoJSON
  // TypeORM không hiểu GEOGRAPHY natively
  // → dùng type: 'geography' với spatialFeatureType và srid
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location!: GeoPoint | null;

  @Column({ name: 'cover_url', nullable: true, type: 'text' })
  coverUrl!: string;

  @Column({ name: 'is_anonymous', default: false })
  isAnonymous!: boolean;

  @Column({
    type: 'enum',
    enum: PlaceStatus,
    default: PlaceStatus.PENDING,
  })
  status!: PlaceStatus;

  @Column({ name: 'avg_rating', type: 'decimal', precision: 2, scale: 1, default: 0 })
  avgRating!: number;

  @Column({ name: 'review_count', default: 0 })
  reviewCount!: number;

  // --- Relations ---
  @ManyToOne(() => Category, (cat) => cat.places, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @ManyToOne(() => User, (user) => user.places, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  // N-N với Tags qua bảng place_tags
  @ManyToMany(() => Tag, (tag) => tag.places, { cascade: true })
  @JoinTable({
    name: 'place_tags',
    joinColumn:        { name: 'place_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id',   referencedColumnName: 'id' },
  })
  tags!: Tag[];

  @OneToMany(() => Review, (review) => review.place)
  reviews!: Review[];

  @OneToMany(() => PlaceImage, (img) => img.place)
  images!: PlaceImage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}