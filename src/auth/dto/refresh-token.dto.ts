import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RefreshTokenDto {

    @ApiProperty()
    @IsString()
    refreshToken!: string;
}
