import { NextResponse } from 'next/server';
import { IncubationService } from '@/lib/incubation';

export async function GET() {
  try {
    const stats = IncubationService.getStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
