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

export class HolidaysService {
  private dataSource!: DataSource;
  private repository!: Repository<HolidaysEntity>;
  private emprepository!: Repository<EmployeeEntity>;

  public async init() {
    this.dataSource = await initDB();
    this.repository = this.dataSource.getRepository(HolidaysEntity);
    this.emprepository = this.dataSource.getRepository(EmployeeEntity);
  }

  async get() {
    try {
      const currentYear = new Date().getFullYear();
      const Holidays: any = await this.repository.find({
        order: { id: "ASC" },
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
      const projects = 5;
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
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: MESSAGES.DATA_LIST_FAILURE,
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
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
    } catch (error) {
      return {
        success: false,
        message: MESSAGES.DATA_LIST_FAILURE,
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async save(payload: HolidaysDTO) {
    const newHolyday = new HolidaysEntity();

    try {
      const response = await this.repository.save(payload);
      return {
        success: true,
        message: getSuccessMessage("Holyday"),
        data: response,
      };
    } catch (error) {
      console.error("Holyday Save Error:", error);
      return {
        success: false,
        message: getErrorMessage("Holyday"),
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
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage("Holyday"),
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
    } catch (error) {
      return {
        success: false,
        message: MESSAGES.DELETE_FAILURE,
        error,
      };
    }
  }
}
