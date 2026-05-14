import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionHandler } from './common/filters/global-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
   
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionHandler());

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true,
    exceptionFactory:(errors)=>{
      const errorTransformed = errors?.flatMap((err)=> Object.values(err.constraints || {}));
      return new BadRequestException({ message: 'Validation Failed', errors:errorTransformed })
    }
  }));

// Swagger Setup
  const swaggerConfig = new DocumentBuilder()
  .setTitle("Nest Application")
  .setDescription("Api Endpoints Documentation")
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const swaggerDocument = SwaggerModule.createDocument(app,swaggerConfig);
  SwaggerModule.setup('/swagger',app,swaggerDocument);
  
  // Port setup
  const configService = app.get(ConfigService);
  const Port = configService.get<number>('Port') || 5000;
  await app.listen(Port);
}
bootstrap();
