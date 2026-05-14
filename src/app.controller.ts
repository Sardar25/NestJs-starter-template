import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

}
