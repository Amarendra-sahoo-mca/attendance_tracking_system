import { NextRequest, NextResponse } from "next/server";
import { LeaveEntitlementsController } from "./leave_entitlementsController";
import { LeaveEntitlementsCreateDTO, UpdateLeaveEntitlementsDTO } from "./leave_entitlements.dto";


const controller = new LeaveEntitlementsController();

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
        const response = await controller.save(body as LeaveEntitlementsCreateDTO);
        return NextResponse.json(response);
    } catch (error) {
       return NextResponse.json({ error }, { status: 500 });
    }
}

