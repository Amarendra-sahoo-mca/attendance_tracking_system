import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { ApiResponse } from "../types/ApiResponse";
import { LeaveEntitlementsService } from "./leave_entitlementsService";
import { LeaveEntitlementsCreateDTO, UpdateLeaveEntitlementsDTO } from "./leave_entitlements.dto";
import { createService, initDB } from "../utils/db";


@Route("leave_entitlements")
@Tags("Leave Entitlements")
export class LeaveEntitlementsController extends Controller {
    private tagsService = new LeaveEntitlementsService();

    @Get("/")
    public async getAll(): Promise<ApiResponse<LeaveEntitlementsCreateDTO[]>> {
        
        const service = await createService(LeaveEntitlementsService);
        return service.get();
    }

    @Get("/{id}")
    public async getById(@Path() id: number): Promise<ApiResponse<any>> {
        const service = await createService(LeaveEntitlementsService);
        return service.getById(id);
    }

    @Post()
    public async save(@Body() body: LeaveEntitlementsCreateDTO) {
        const service = await createService(LeaveEntitlementsService);
        return service.save(body);
    }

    @Put('/{id}')
    public async update(@Path() id: number,@Body() body: UpdateLeaveEntitlementsDTO) {
        const service = await createService(LeaveEntitlementsService);
        return service.update(id,body);
    }

    @Delete("/{id}")
    public async delete(@Path() id: number): Promise<ApiResponse<null>> {
    const service = await createService(LeaveEntitlementsService);
    return service.delete(id);
    }
}