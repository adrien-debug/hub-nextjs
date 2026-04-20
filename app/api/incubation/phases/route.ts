import { NextResponse } from 'next/server';
import { IncubationService } from '@/lib/incubation';

export async function GET() {
  try {
    const phases = IncubationService.getAllPhases();
    return NextResponse.json({ success: true, data: phases });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
