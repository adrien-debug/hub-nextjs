import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API fonctionne correctement',
    port: 6000,
    timestamp: new Date().toISOString(),
  });
}
