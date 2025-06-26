import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "./entities/user";
import { EmployeeEntity } from "./entities/employee";
import { HolidaysEntity } from "./entities/holidays";
import { AttendanceEntity } from "./entities/attendance";
import { LeaveEntitlementsEntity } from "./entities/leave_entitlements";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "", 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserEntity, EmployeeEntity, HolidaysEntity, AttendanceEntity,LeaveEntitlementsEntity],
  synchronize: true,
  logging: false,
});
