import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type User = {
  id: string;
  email: string;
};

export const GetUser = createParamDecorator(
  (attribute: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (attribute) {
      return request?.user?.[attribute];
    }
    return request?.user;
  },
);
