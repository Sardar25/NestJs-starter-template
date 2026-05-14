import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from 'src/common/config/jwt.config';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy,'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refresh.secret,
    });
  }

  async validate(payload) {
    return {
      userId: payload.sub,
      tokenId: payload.tokenId,
    };
  }
}
