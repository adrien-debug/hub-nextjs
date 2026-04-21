import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'adrien-debug';

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ success: false, error: 'GITHUB_TOKEN not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&sort=pushed&direction=desc`, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      console.error(`[github/repos] GitHub API error: ${res.status}`);
      return NextResponse.json({ success: false, error: `GitHub API ${res.status}` }, { status: res.status });
    }

    const repos = await res.json();
    const data = repos.map((r: any) => ({
      name: r.name,
      full_name: r.full_name,
      url: r.html_url,
      description: r.description,
      language: r.language,
      pushed_at: r.pushed_at,
      created_at: r.created_at,
      default_branch: r.default_branch,
      visibility: r.visibility,
      topics: r.topics || [],
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('[github/repos] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
