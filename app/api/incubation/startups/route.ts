import { NextRequest, NextResponse } from 'next/server';
import { IncubationService } from '@/lib/incubation';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      status: searchParams.get('status') || undefined,
      cohort: searchParams.get('cohort') || undefined,
      search: searchParams.get('search') || undefined,
    };
    const startups = IncubationService.listStartups(filters);
    return NextResponse.json({ success: true, data: startups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await req.json();
    const startup = IncubationService.createStartup(body);
    return NextResponse.json({ success: true, data: startup }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
