import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { ApiResponse } from "../types/ApiResponse";
import { ProjectsService } from "./projectsService";
import { ProjectsCreateDTO, UpdateProjectsDTO } from "./projects.dto";
import { createService } from "../utils/db";


@Route("projects")
@Tags("projects")
export class ProjectsController extends Controller {
    private tagsService = new ProjectsService();

    @Get("/")
    public async getAll(): Promise<ApiResponse<ProjectsCreateDTO[]>> {
        const service = await createService(ProjectsService);
        return service.get();
    }

    @Get("/{id}")
    public async getById(@Path() id: number): Promise<ApiResponse<any>> {
        const service = await createService(ProjectsService);
        return service.getById(id);
    }

    @Post()
    public async save(@Body() body: ProjectsCreateDTO) {
        const service = await createService(ProjectsService);
        return service.save(body);
    }

    @Put('/{id}')
    public async update(@Path() id: number,@Body() body: UpdateProjectsDTO) {
        const service = await createService(ProjectsService);
        return service.update(id,body);
    }

    @Delete("/{id}")
    public async delete(@Path() id: number): Promise<ApiResponse<null>> {
    const service = await createService(ProjectsService);
    return service.delete(id);
    }
}