import { NextResponse } from 'next/server';
import { getActivity } from '@/db/queries';

export async function GET() {
    try {
        const days = await getActivity();
        return NextResponse.json({ days });
    } catch (err) {
        console.error('Error fetching activity:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}