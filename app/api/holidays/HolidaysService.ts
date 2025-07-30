import { DataSource, Repository } from "typeorm";
import { initDB } from "../utils/db";

import {
  getErrorMessage,
  getSuccessMessage,
  HttpStatus,
  IResponse,
  MESSAGES,
  missingDataMessage,
} from "../constants/messages";
import { HolidaysDTO, UpdateHolidaysDTO } from "./Holidays.dto";
import { HolidaysEntity } from "../db/entities/holidays";
import { EmployeeEntity } from "../db/entities/employee";
import { getRemainingWorkingDays, getWorkingDaysIn2025 } from "../utils/calender";
import { ProjectsEntity } from "../db/entities/projectes.entity";

export class HolidaysService {
  private dataSource!: DataSource;
  private repository!: Repository<HolidaysEntity>;
  private emprepository!: Repository<EmployeeEntity>;
  private project!: Repository<ProjectsEntity>;

  public async init() {
    this.dataSource = await initDB();
    this.repository = this.dataSource.getRepository(HolidaysEntity);
    this.emprepository = this.dataSource.getRepository(EmployeeEntity);
    this.project = this.dataSource.getRepository(ProjectsEntity);
  }

  async getDashboard() {
    try {
      const currentYear = new Date().getFullYear();
      const Holidays: any = await this.repository.find({
        order: { date: "ASC" },
        where: { year: currentYear.toString() },
      });
      let groupHolidayCount = 0;
      let groupHolidays = 0;
      // finding total number of group holidays
      Holidays.map((item: any) => {
        if (item.endDate) {
          const date1 = new Date(item.endDate);
          const date2 = new Date(item.date);
          // Get time difference in milliseconds
          const diffTime = Math.abs(date1.getTime() - date2.getTime());

          // Convert milliseconds to days
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          groupHolidayCount++;
          groupHolidays += diffDays+1;
        }
      });
      const holidaysCount = Holidays.length - groupHolidayCount + groupHolidays;
      const projects = await this.project.count();
      const employees = await this.emprepository.count();
      const totalWorkingDays = 365 - 76 - holidaysCount;
      const remainingWorkingdays = getRemainingWorkingDays(Holidays);
      const workingdayGraph = getWorkingDaysIn2025(Holidays)
      const data2 = [
        { name: "Total Projects", value: projects },
        { name: "Total Employees", value: employees },
        { name: "Total Working Days", value: totalWorkingDays },
        { name: "Total Holidays", value: holidaysCount },
        { name: "Remaining Working Days", value: remainingWorkingdays },
      ];

      const responce: IResponse = {
        success: true,
        message: MESSAGES.DATA_LIST_SUCCESS,
        data: { cardsData: data2, Holidays, workingdayGraph },
        statusCode: HttpStatus.OK,
      };
      return responce;
    } catch (error:any) {
      console.log(error);

      return {
        success: false,
        message: error.message,
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async get() {
    try {
      const tags = await this.repository.find({
        // order: { id: "DESC" },
      });
      const response: IResponse = {
        success: true,
        message: MESSAGES.DATA_LIST_SUCCESS,
        data: tags,
        statusCode: HttpStatus.OK,
      };
      return response;
    } catch (error:any) {
      return {
        success: false,
        message: error.message,
        data: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      } as IResponse;
    }
  }

  async getById(id: number) {
    try {
      const Holyday = await this.repository.findOneBy({ id });
      if (!Holyday) {
        throw {
          success: false,
          message: MESSAGES.DATA_LIST_FAILURE,
          data: null,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
      const responce: IResponse = {
        success: true,
        message: MESSAGES.DATA_LIST_SUCCESS,
        data: Holyday,
        statusCode: HttpStatus.OK,
      };
      return responce;
    } catch (error:any) {
      return {
        success: false,
        message: error.message,
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async save(payload: HolidaysDTO) {
    try {
      payload.year = payload.date.substring(0, 4);
      payload.date = payload.date.split('T')[0];
      payload.endDate = payload.endDate && payload.endDate.split('T')[0];
      const response = await this.repository.save(payload);
      return {
        success: true,
        message: getSuccessMessage("Holyday"),
        data: response,
      };
    } catch (error:any) {
      console.error("Holyday Save Error:", error);
      return {
        success: false,
        message: error.message,
        error: error,
      };
    }
  }

  async update(payload: UpdateHolidaysDTO) {
    const Holyday = await this.repository.findOneBy({ id: payload.id });
    if (!Holyday) {
      return {
        success: false,
        message: MESSAGES.DATA_LIST_FAILURE,
      };
    }
    const updatedHolyday = Holyday;
    updatedHolyday.name = payload.name ?? Holyday.name;

    try {
      const response = await this.repository.save(updatedHolyday);
      return {
        success: true,
        message: getSuccessMessage("Holyday"),
        data: response,
      };
    } catch (error:any) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  }

  async delete(id: number) {
    const Holyday = await this.repository.findOneBy({ id });
    if (!Holyday) {
      return {
        success: false,
        message: MESSAGES.DATA_LIST_FAILURE,
      };
    }

    try {
      await this.repository.remove(Holyday);
      return {
        success: true,
        message: MESSAGES.DELETE_SUCCESS,
      };
    } catch (error:any) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  }
}
