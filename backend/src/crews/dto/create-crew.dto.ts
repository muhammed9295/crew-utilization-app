import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateCrewDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsDateString()
    @IsNotEmpty()
    dateOfJoining: string;

    @IsString()
    @IsNotEmpty()
    zoneId: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsOptional()
    scheduledHours?: number;
}
