import { NextRequest, NextResponse } from "next/server";
import { ProjectsCreateDTO } from "../projects.dto";
import { ProjectsController } from "../projectsController";

const controller = new ProjectsController();

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const response = await controller.getById(Number(id));
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}


export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const body = await request.json();
    try {
        const response = await controller.update(Number(id),body);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const response = await controller.delete(Number(id));
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
