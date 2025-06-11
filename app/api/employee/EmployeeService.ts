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
import { EmployeeCreateDTO, UpdateEmployeeDTO } from "./Employee.dto";
import { EmployeeEntity } from "../db/entities/employee";
import { UserEntity } from "../db/entities/user";
import { UserType } from "../common.enum";

export class EmployeeService {
  private dataSource!: DataSource;
  private repository!: Repository<EmployeeEntity>;

  public async init() {
    this.dataSource = await initDB();
    this.repository = this.dataSource.getRepository(EmployeeEntity);
  }

  async get() {
    try {
      const tags = await this.repository.find({
        relations: ["user"],
        order: { id: "DESC" },
      });
      const response: IResponse = {
        success: true,
        message: MESSAGES.DATA_LIST_SUCCESS,
        data: tags,
        statusCode: HttpStatus.OK,
      };
      return response;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: MESSAGES.DATA_LIST_FAILURE,
        data: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      } as IResponse;
    }
  }

  async getById(id: number) {
    try {
      const tag = await this.repository.findOneBy({ id });
      const response: IResponse = {
        success: true,
        message: MESSAGES.DATA_LIST_SUCCESS,
        data: tag,
        statusCode: HttpStatus.OK,
      };
      return response;
    } catch (error) {
      return {
        success: false,
        message: MESSAGES.DATA_LIST_FAILURE,
        data: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      } as IResponse;
    }
  }

  async save(payload: EmployeeCreateDTO) {
    const newEmp = new EmployeeEntity();
    const newUser = new UserEntity();
    newEmp.name = payload.name;
    newEmp.DOJ = payload.DOJ.split("T")[0];
    newUser.email = payload.email;
    newUser.password = "123456";
    newUser.type = UserType.EMPLOYEE;
    newEmp.user = newUser;
    try {
      const response = await this.repository.save(newEmp);
      return {
        success: true,
        message: getSuccessMessage("Employee"),
        data: response,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage("Employee"),
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(id: number, payload: UpdateEmployeeDTO) {
    try {
      const tag = await this.repository.findOneBy({ id });
      if (!tag) {
        throw {
          success: false,
          message: MESSAGES.DATA_LIST_FAILURE,
          data: null,
          statusCode: HttpStatus.BAD_REQUEST,
        } as IResponse;
      }
      const response = await this.repository.save({...payload,DOJ:payload.DOJ.split("T")[0]});
      return {
        success: true,
        message: getSuccessMessage("Emaploye"),
        data: response,
        statusCode: HttpStatus.OK,
      } as IResponse;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage("Emaployee"),
        data: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      } as IResponse;
    }
  }

  async delete(id: number) {
     try {
    const tag = await this.repository.findOneBy({id});
    if (!tag) {
      throw {
        success: false,
        message: MESSAGES.DATA_LIST_FAILURE,
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }as IResponse;
    }
      await this.repository.delete(id);
      return {
        success: true,
        message: MESSAGES.DELETE_SUCCESS,
        data: null,
        statusCode: HttpStatus.NO_CONTENT,
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
