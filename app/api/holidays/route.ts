import { NextRequest, NextResponse } from "next/server";
import { HolidaysController } from "./HolidaysController";
import { HolidaysDTO, UpdateHolidaysDTO } from "./Holidays.dto";

const controller = new HolidaysController();

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
        const response = await controller.save(body as HolidaysDTO);
        return NextResponse.json(response);
    } catch (error) {
        NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await controller.update(body as UpdateHolidaysDTO);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}