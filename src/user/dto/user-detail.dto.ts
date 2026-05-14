import { Exclude, Expose } from 'class-transformer'
import { BaseDetailDto } from 'src/common/dto/base-detail.dto'

@Exclude()
export class UserDetailDto extends BaseDetailDto {
   @Expose()
   name!:string

   @Expose()
   email!:string
}