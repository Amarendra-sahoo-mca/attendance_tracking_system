import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { ApiResponse } from "../types/ApiResponse";
import { AttendanceService } from "./AttendanceService";
import { AttendanceCreateDTO, UpdateAttendanceDTO } from "./Attendance.dto";
import { createService, initDB } from "../utils/db";


@Route("attendance")
@Tags("Attendance")
export class AttendanceController extends Controller {
    private tagsService = new AttendanceService();

    @Get("/")
    public async getAll(): Promise<ApiResponse<AttendanceCreateDTO[]>> {
        
        const service = await createService(AttendanceService);
        return service.get();
    }

    @Get("/{id}")
    public async getById(@Path() id: number): Promise<ApiResponse<any>> {
        const service = await createService(AttendanceService);
        return service.getById(id);
    }

    @Post()
    public async save(@Body() body: AttendanceCreateDTO) {
        const service = await createService(AttendanceService);
        return service.save(body);
    }

    @Put('/{id}')
    public async update(@Path() id: number,@Body() body: UpdateAttendanceDTO) {
        const service = await createService(AttendanceService);
        return service.update(id,body);
    }

    @Delete("/{id}")
    public async delete(@Path() id: number): Promise<ApiResponse<null>> {
    const service = await createService(AttendanceService);
    return service.delete(id);
    }
}