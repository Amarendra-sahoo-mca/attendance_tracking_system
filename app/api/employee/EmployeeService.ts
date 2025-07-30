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
import { groupCount } from "../utils/functions";
import { LeaveEntitlementsEntity } from "../db/entities/leave_entitlements";
import { getDuration } from "../utils/calender";

export class EmployeeService {
  private dataSource!: DataSource;
  private repository!: Repository<EmployeeEntity>;
  private userRepository!: Repository<UserEntity>;
  private leave_entitlements!: Repository<LeaveEntitlementsEntity>;

  public async init() {
    this.dataSource = await initDB();
    this.repository = this.dataSource.getRepository(EmployeeEntity);
    this.userRepository = this.dataSource.getRepository(UserEntity);
    this.leave_entitlements = this.dataSource.getRepository(LeaveEntitlementsEntity);
  }

  async get() {
    try {
      const tags = await this.repository.find({
        relations: ['user',],
        order: { id: "DESC" },
      });
      
      // tags.map((item:any)=>{
      //   item.DOJ = new Date(item.DOJ).toLocaleDateString("en-GB");
      // })
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
      const tag:any = await this.repository.findOne({
        where:{id},
        relations:['user','attendance']
      });
      if(!tag){
        throw {
          success: false,
          message: MESSAGES.DATA_LIST_FAILURE,
          data: null,
          statusCode: HttpStatus.BAD_REQUEST,
        } as IResponse;
      }
      
      const leave_criteria = await this.leave_entitlements.find();
      const groupdate = groupCount(tag.attendance,leave_criteria)
      const experience = getDuration(tag.DOJ);
      const response: IResponse = {
        success: true,
        message: MESSAGES.DATA_LIST_SUCCESS,
        data: {...tag,experience,leave_info:groupdate,DOJ:new Date(tag.DOJ).toLocaleDateString("en-GB")},
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

  async save(payload: EmployeeCreateDTO) {
    const newEmp:any ={};
    const newUser = new UserEntity();
    newEmp.name = payload.name;
    newEmp.DOJ = payload.DOJ.split("T")[0];
    newEmp.employee_id = payload.employee_id;
    newUser.email = payload.email;
    newUser.password = "123456";
    newUser.type = UserType.EMPLOYEE;
    // newEmp.user = newUser;
    try {
      const employeeEntity = this.repository.create({
        ...newEmp,
        user:newUser
      })
      const response = await this.repository.save(employeeEntity);
      
      return {
        success: true,
        message: getSuccessMessage("Employee"),
        data: response,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error:any) {
      throw  {
        success: false,
        message: error.message,
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(id: number, payload: any) {
      const {email, ...employee} = payload;
    try {
      const tag = await this.repository.findOne({where:{id},relations:["user"]});
      if (!tag) {
        throw {
          success: false,
          message: MESSAGES.DATA_LIST_FAILURE,
          data: null,
          statusCode: HttpStatus.BAD_REQUEST,
        } as IResponse;
      }
      employee.user = tag.user;
      employee.user.email = email;
      employee.DOJ = employee.DOJ.split("T")[0];
      const response = await this.repository.save(employee);
      return {
        success: true,
        message: getSuccessMessage("Emaploye"),
        data: response,
        statusCode: HttpStatus.OK,
      } as IResponse;
    } catch (error:any) {
      return {
        success: false,
        message: error.message,
        data: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      } as IResponse;
    }
  }

  async delete(id: number) {
     try {
    const tag = await this.repository.findOne({
      where:{id},
      // relations: ["user"],
    }
    );
    
    if (!tag) {
      throw {
        success: false,
        message: MESSAGES.DATA_LIST_FAILURE,
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }as IResponse;
    }
      // await this.userRepository.remove(tag.user);
      await this.repository.remove(tag);
      return {
        success: true,
        message: MESSAGES.DELETE_SUCCESS,
        data: null,
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error:any) {
      return {
        success: false,
        message:error.message,
        error,
      };
    }
  }
}
