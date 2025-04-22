import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString } from "class-validator";

export class QueryParamsDto{
    @IsString()
    @ApiProperty({ example: '1', description: 'current page' })
    page: string;

}