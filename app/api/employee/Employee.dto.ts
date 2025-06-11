import { IsNumber, IsString } from "class-validator";
import { Example } from "tsoa";

export class EmployeeCreateDTO {
    @IsString()
    @Example("jhon deo")
    name!: string;

    @IsString()
    @Example("DD/MM/YYYY")
    DOJ!: string;

    @IsString()
    @Example("@example.com")
    email!: string;
}

export class UpdateEmployeeDTO  {
    @IsString()
    @Example("jhon deo")
    name!: string;

    @IsString()
    @Example("DD/MM/YYYY")
    DOJ!: string;
}