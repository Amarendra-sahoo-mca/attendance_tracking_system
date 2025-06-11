import { NextRequest, NextResponse } from "next/server";
import { EmployeeController } from "./EmployeeController";
import { EmployeeCreateDTO, UpdateEmployeeDTO } from "./Employee.dto";


const controller = new EmployeeController();

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

        const response = await controller.save(body as EmployeeCreateDTO);
        return NextResponse.json(response);
    } catch (error) {
        NextResponse.json({ error }, { status: 500 });
    }
}

