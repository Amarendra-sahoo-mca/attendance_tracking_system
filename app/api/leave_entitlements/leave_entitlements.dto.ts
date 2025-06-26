import { IsBoolean, IsEnum, IsNumber, IsString } from "class-validator";
import { Example } from "tsoa";
import { LeaveType } from "../common.enum";

export class LeaveEntitlementsCreateDTO {
  @IsEnum(LeaveType)
  @Example(LeaveType.Sickness)
  type!: LeaveType;

  @IsString()
  theme!:string;

  @IsNumber()
  days!: number;
}

export class UpdateLeaveEntitlementsDTO {
  @IsEnum(LeaveType)
  @Example(LeaveType.Sickness)
  type!: LeaveType;

  @IsString()
  theme!:string;
  
  @IsNumber()
  days!: number;
}
