import { NextRequest, NextResponse } from "next/server";
import { HolidaysController } from "../HolidaysController";

const controller = new HolidaysController();




export async function GET(request: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;
    try {
        const response = await controller.getById(Number(id));
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;
    try {
        const response = await controller.delete(Number(id));
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
