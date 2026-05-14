import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BaseDetailDto {
  @Expose()
  id!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
