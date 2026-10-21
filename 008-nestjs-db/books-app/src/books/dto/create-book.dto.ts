import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    year?: number;

    @IsOptional()
    @IsString()
    genre?: string;
}