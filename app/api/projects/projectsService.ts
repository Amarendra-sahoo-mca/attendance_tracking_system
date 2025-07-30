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
import { ProjectsCreateDTO, UpdateProjectsDTO } from "./projects.dto";
import { UserEntity } from "../db/entities/user";
import { UserType } from "../common.enum";
import { EmployeeEntity } from "../db/entities/employee";
import { ProjectsEntity } from "../db/entities/projectes.entity";

export class ProjectsService {
  private dataSource!: DataSource;
  private repository!: Repository<ProjectsEntity>;
  private empRepository!: Repository<EmployeeEntity>;

  public async init() {
    this.dataSource = await initDB();
    this.repository = this.dataSource.getRepository(ProjectsEntity);
    this.empRepository = this.dataSource.getRepository(EmployeeEntity);
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
      const tag = await this.repository.findOneBy({ id });
      const response: IResponse = {
        success: true,
        message: MESSAGES.DATA_LIST_SUCCESS,
        data: tag,
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

  async save(payload: ProjectsCreateDTO){    try {
      const ProjectsEntity = this.repository.create(payload)
      const response = await this.repository.save(ProjectsEntity);
      return {
        success: true,
        message: getSuccessMessage("Project"),
        data: response,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error:any) {
      throw {
        success: false,
        message: error.message,
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(id: number, payload: any) {
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
      
      const response = await this.repository.save(payload);
      return {
        success: true,
        message: getSuccessMessage("Project"),
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
    } catch (error:any) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  }
}
