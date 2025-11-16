import { NextRequest, NextResponse } from 'next/server';
import { getReviewForecast, getHourlyReviewForecast } from '@/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') ?? 'daily';

    if (mode === 'hourly') {
      const hourly = await getHourlyReviewForecast();
      return NextResponse.json({ hourly });
    }

    const daily = await getReviewForecast(7);
    return NextResponse.json({ daily });
  } catch (err) {
    console.error('Error fetching review forecast:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
