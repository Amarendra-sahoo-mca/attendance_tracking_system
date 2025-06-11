import { readFile } from 'fs/promises';
import { NextRequest } from 'next/server';
import path from 'path';

export async function GET(req: NextRequest) {
    const filePath = path.join(process.cwd(), 'public', 'swagger.html');
    const html = await readFile(filePath, 'utf-8');

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}
