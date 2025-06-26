import { IsBoolean, IsNumber, IsString } from "class-validator";
import { Example } from "tsoa";

export class AttendanceCreateDTO {
    @IsString()
    @Example("sicl leave")
    absence_type!: string;

    @IsNumber()
    employee!: number;

    @IsString()
    @Example("DD/MM/YYYY")
    start_date!: string;

    @IsString()
    @Example("peta katuchi")
    description!: string;

    @IsBoolean()
    is_half_day!: boolean;

    @IsString()
    @Example("DD/MM/YYYY")
    end_date!: string;

}

export class UpdateAttendanceDTO  {
    @IsString()
    @Example("sicl leave")
    absence_type!: string;

    @IsString()
    @Example("DD/MM/YYYY")
    start_date!: string;

    @IsString()
    @Example("DD/MM/YYYY")
    end_date!: string;
}