import { NextRequest, NextResponse } from 'next/server';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

export async function GET(req: NextRequest) {
  if (!VERCEL_TOKEN) {
    return NextResponse.json({ success: false, error: 'VERCEL_TOKEN not configured' }, { status: 500 });
  }

  const projectId = req.nextUrl.searchParams.get('projectId');
  const teamId = req.nextUrl.searchParams.get('teamId');

  if (!projectId || !teamId) {
    return NextResponse.json({ success: false, error: 'projectId and teamId required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&teamId=${teamId}&limit=10`, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[vercel/deployments] API error: ${res.status}`);
      return NextResponse.json({ success: false, error: `Vercel API ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    const deployments = (data.deployments || []).map((d: any) => ({
      id: d.uid,
      state: d.state,
      url: d.url ? `https://${d.url}` : null,
      createdAt: d.createdAt,
      target: d.target,
      meta: { githubCommitMessage: d.meta?.githubCommitMessage, githubCommitRef: d.meta?.githubCommitRef },
    }));

    return NextResponse.json({ success: true, data: deployments });
  } catch (err: any) {
    console.error('[vercel/deployments] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
