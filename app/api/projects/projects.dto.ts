import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Example } from "tsoa";
import { LeaveType } from "../common.enum";

export class ProjectsCreateDTO {

  @IsString()
  name!:string;

  @IsString()
  start_date!:string;

  @IsString()
  @IsOptional()
  end_date!:string;

  @IsNumber()
  @IsOptional()
  cost!: number;
}

export class UpdateProjectsDTO {

  @IsString()
  name!:string;

  @IsString()
  start_date!:string;

  @IsString()
  @IsOptional()
  end_date!:string;

  @IsNumber()
  @IsOptional()
  cost!: number;
}
