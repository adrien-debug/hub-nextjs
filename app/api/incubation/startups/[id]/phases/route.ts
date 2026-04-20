import { NextRequest, NextResponse } from 'next/server';
import { IncubationService } from '@/lib/incubation';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const phases = IncubationService.getStartupPhases(id);
    return NextResponse.json({ success: true, data: phases });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
