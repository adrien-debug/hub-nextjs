import { NextRequest, NextResponse } from 'next/server';
import { IncubationService } from '@/lib/incubation';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; phaseId: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { id, phaseId } = await params;
    const body = await req.json();
    const phase = IncubationService.updateStartupPhase(id, parseInt(phaseId), body);
    return NextResponse.json({ success: true, data: phase });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
