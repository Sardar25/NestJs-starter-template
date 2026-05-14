import { BaseEntity } from '../../db/entities/base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  name!: string;
  @Column({ unique: true })
  email!: string;
  @Column()
  password!: string;
}
