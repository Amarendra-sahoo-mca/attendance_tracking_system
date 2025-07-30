import { NextRequest, NextResponse } from "next/server";
import { ProjectsCreateDTO, UpdateProjectsDTO } from "./projects.dto";
import { ProjectsController } from "./projectsController";


const controller = new ProjectsController();

export async function GET(request: NextRequest) {
    try {
        const response = await controller.getAll();
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        const response = await controller.save(body as ProjectsCreateDTO);
        return NextResponse.json(response);
    } catch (error) {
       return NextResponse.json({ error }, { status: 500 });
    }
}

