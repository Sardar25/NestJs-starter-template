import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../db/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @Column({
    type: 'text',
  })
  token!: string;

  @Column({
    type: 'timestamp',
  })
  expiresAt!: Date;

  @Column({
    default: false,
  })
  isRevoked!: boolean;
}
