import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateZoneDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    status?: string;
}
