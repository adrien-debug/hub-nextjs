import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/projects';

export async function GET() {
  try {
    const stats = ProjectService.getStatistics();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
