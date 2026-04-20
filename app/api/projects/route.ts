import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/projects';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const published = searchParams.get('published');

    const filters: any = {};
    if (status) filters.status = status;
    if (published !== null) filters.published = published === 'true';

    const projects = ProjectService.list(filters);

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const project = ProjectService.create(body);

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
