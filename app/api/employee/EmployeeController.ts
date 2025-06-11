import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { ApiResponse } from "../types/ApiResponse";
import { EmployeeService } from "./EmployeeService";
import { EmployeeCreateDTO, UpdateEmployeeDTO } from "./Employee.dto";
import { createService, initDB } from "../utils/db";


@Route("employee")
@Tags("employee")
export class EmployeeController extends Controller {
    private tagsService = new EmployeeService();

    @Get("/")
    public async getAll(): Promise<ApiResponse<EmployeeCreateDTO[]>> {
        
        const service = await createService(EmployeeService);
        return service.get();
    }

    @Get("/{id}")
    public async getById(@Path() id: number): Promise<ApiResponse<any>> {
        const service = await createService(EmployeeService);
        return service.getById(id);
    }

    @Post()
    public async save(@Body() body: EmployeeCreateDTO) {
        const service = await createService(EmployeeService);
        return service.save(body);
    }

    @Put('/{id}')
    public async update(@Path() id: number,@Body() body: UpdateEmployeeDTO) {
        const service = await createService(EmployeeService);
        return service.update(id,body);
    }

    @Delete("/{id}")
    public async delete(@Path() id: number): Promise<ApiResponse<null>> {
    const service = await createService(EmployeeService);
    return service.delete(id);
    }
}