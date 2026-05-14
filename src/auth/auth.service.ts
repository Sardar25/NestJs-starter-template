import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { SuccessResponse } from 'src/common/dto/success-response.dto';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, randomUUID } from 'crypto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { jwtConfig } from 'src/common/config/jwt.config';
import { plainToInstance } from 'class-transformer';
import { UserDetailDto } from 'src/user/dto/user-detail.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    readonly refreshTokenRepo: Repository<RefreshToken>,
    readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const isEmailExist = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (isEmailExist) {
      throw new BadRequestException('Email already exist');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return SuccessResponse.withMessage('User created successfully');
  }

  async signIn(loginDto: LoginDto) {
    const isUserExist = await this.userService.findByEmail(loginDto.email);
    if (
      !isUserExist ||
      !(await bcrypt.compare(loginDto.password, isUserExist.password))
    ) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
    const accessToken = await this.generateAccessToken(isUserExist);
    const refreshToken = await this.generateAndSaveRefreshToken(isUserExist);
    return SuccessResponse.withData(
      { accessToken, refreshToken },
      'User logged in successfully',
    );
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: jwtConfig.refresh.secret,
        ignoreExpiration: false,
      });
      const refreshTokenEntity = await this.refreshTokenRepo.findOne({
        where: { id: payload.tokenId },
      });
      if (
        !refreshTokenEntity ||
        refreshTokenEntity.isRevoked ||
        refreshTokenEntity.expiresAt < new Date() ||
        !(await bcrypt.compare(
          refreshTokenDto.refreshToken,
          refreshTokenEntity.token,
        ))
      ) {
        throw new UnauthorizedException('Unauthorized');
      }

      refreshTokenEntity.isRevoked = true;
      await this.refreshTokenRepo.save(refreshTokenEntity);
      const user = await this.userService.findById(payload.sub);
      const accessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateAndSaveRefreshToken(user);
      return SuccessResponse.withData(
        { accessToken, refreshToken: newRefreshToken },
        'Tokens updated successfully',
      );
    } catch (e) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async currentUser(id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return SuccessResponse.withData(
      plainToInstance(UserDetailDto, user, {
        excludeExtraneousValues: true,
      }),
      'User information retrived successfully',
    );
  }

  private async generateAndSaveRefreshToken(payload) {
    const tokenId = randomUUID();
    const refreshTokenEntity = this.refreshTokenRepo.create({
      id: tokenId,
      user: payload,
      expiresAt: jwtConfig.refresh.expiresInDate,
    });
    const refreshToken = this.jwtService.sign(
      {
        tokenId: tokenId,
        sub: payload.id,
      },
      {
        secret: jwtConfig.refresh.secret,
        expiresIn: jwtConfig.refresh.expiresIn as any,
      },
    );
    refreshTokenEntity.token = await bcrypt.hash(refreshToken, 10);
    await this.refreshTokenRepo.save(refreshTokenEntity);
    return refreshToken;
  }

  private async generateAccessToken(payload) {
    return this.jwtService.sign(
      {
        sub: payload.id,
        email: payload.email,
      },
      {
        expiresIn: jwtConfig.access.expiresIn as any,
        secret: jwtConfig.access.secret,
      },
    );
  }
}
