import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfig } from 'src/common/config/jwt.config';
import { JwtAccessTokenStrategy } from './strategy/jwt-access.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh.strategy';

@Module({
  imports:[
    UserModule, 
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
