import { NextRequest, NextResponse } from "next/server";
import { HolidaysController } from "../HolidaysController";

const controller = new HolidaysController();

export async function GET(request: NextRequest) {
    try {
        const response = await controller.getdashboard();
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
