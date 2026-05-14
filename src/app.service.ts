import { BadRequestException, Injectable } from '@nestjs/common';
import { SuccessResponse } from './common/dto/success-response.dto';

@Injectable()
export class AppService {
  getHello() {
    return SuccessResponse.withMessage('data retrived successfully');
  }
}
