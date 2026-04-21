import { NextResponse } from 'next/server';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_IDS = [process.env.VERCEL_TEAM_ID, process.env.VERCEL_TEAM_ID_HEARST].filter(Boolean);

async function fetchProjects(teamId: string) {
  const res = await fetch(`https://api.vercel.com/v9/projects?teamId=${teamId}&limit=100`, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    next: { revalidate: 120 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.projects || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    framework: p.framework,
    teamId,
    url: `https://${p.name}.vercel.app`,
    dashboard: `https://vercel.com/${teamId}/${p.name}`,
    repo: p.link?.repo ? `https://github.com/${p.link.org}/${p.link.repo}` : null,
    repoName: p.link?.repo || null,
    updatedAt: p.updatedAt,
    createdAt: p.createdAt,
  }));
}

export async function GET() {
  if (!VERCEL_TOKEN) {
    return NextResponse.json({ success: false, error: 'VERCEL_TOKEN not configured' }, { status: 500 });
  }

  try {
    const results = await Promise.all(TEAM_IDS.map(id => fetchProjects(id!)));
    const all = results.flat().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return NextResponse.json({ success: true, data: all });
  } catch (err: any) {
    console.error('[vercel/projects] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
