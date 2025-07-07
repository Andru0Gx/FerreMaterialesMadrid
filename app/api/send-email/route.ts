import { sendMail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { to, subject, html } = await req.json();
    try {
        const info = await sendMail({ to, subject, html });
        return NextResponse.json({ success: true, info });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
