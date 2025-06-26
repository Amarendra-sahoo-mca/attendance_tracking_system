import { NextRequest, NextResponse } from "next/server";
import { AttendanceController } from "./AttendanceController";
import { AttendanceCreateDTO, UpdateAttendanceDTO } from "./Attendance.dto";


const controller = new AttendanceController();

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
        const response = await controller.save(body as AttendanceCreateDTO);
        return NextResponse.json(response);
    } catch (error) {
       return NextResponse.json({ error }, { status: 500 });
    }
}

