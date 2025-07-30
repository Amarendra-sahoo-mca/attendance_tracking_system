import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags, } from "tsoa";
import { ApiResponse } from "../types/ApiResponse";
import { HolidaysService } from "./HolidaysService";
import { createService, initDB } from "../utils/db";
import { HolidaysDTO, UpdateHolidaysDTO } from "./Holidays.dto";

@Route("holidays")
@Tags("Holidays")
export class HolidaysController extends Controller {
    private Service = new HolidaysService();

    @Get("/dashboard")
    public async getdashboard(){
        const service = await createService(HolidaysService);
        return service.getDashboard();
    }

    @Get("/")
    public async getAll(): Promise<ApiResponse<HolidaysDTO[]>> {
        const service = await createService(HolidaysService);
        return service.get();
    }

    @Get("/{id}")
    public async getById(@Path() id: number): Promise<ApiResponse<any>> {
        const service = await createService(HolidaysService);
        return service.getById(id);
    }
    @Post()
    @Security("jwt")
    public async save(@Body() body: HolidaysDTO) {
        const service = await createService(HolidaysService);
        return service.save(body);
    }

    @Put()
    @Security("jwt")
    public async update(@Body() body: UpdateHolidaysDTO) {
        const service = await createService(HolidaysService);
        return service.update(body);
    }

    @Delete("/{id}")
    @Security("jwt")
    public async delete(@Path() id: number): Promise<ApiResponse<null>> {
        const service = await createService(HolidaysService);
        return service.delete(id);
    }
}