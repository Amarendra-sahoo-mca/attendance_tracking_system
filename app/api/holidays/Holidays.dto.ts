import { IsNumber, IsOptional, IsString } from "class-validator";
import { Example } from "tsoa";

export class HolidaysDTO {
    @IsString()
    @Example("good friday")
    name!: string;

    @IsString()
    @Example("DD/MM")
    date!: string;

    @IsString()
    @IsOptional()
    @Example("DD/MM")
    endDate!: string;

    @IsString()
    @Example("YYYY")
    year!: string;

}

export class UpdateHolidaysDTO extends HolidaysDTO {
    @IsNumber()
    @Example(1)
    id?: number;
}