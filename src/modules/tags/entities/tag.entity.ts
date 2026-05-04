import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Place } from '../../places/entities/place.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 100 })
  name!: string;

  @ManyToMany(() => Place, (place) => place.tags)
  places!: Place[];
}