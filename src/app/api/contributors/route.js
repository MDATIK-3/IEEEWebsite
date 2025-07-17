import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  if (!token) {
    console.error('GitHub token is missing');
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
  }

  try {
    const res = await fetch('https://api.github.com/repos/MDATIK-3/IEEEWebsite/contributors', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'IEEE-Website',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorMap = {
        401: 'Invalid GitHub token',
        403: 'API rate limit exceeded or insufficient permissions',
        404: 'Repository not found',
      };

      console.error('GitHub API error:', res.status, res.statusText);
      return NextResponse.json(
        { error: errorMap[res.status] || 'Failed to fetch contributors' },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error('Invalid data format from GitHub API:', data);
      return NextResponse.json({ error: 'Invalid data format' }, { status: 500 });
    }

    const contributors = data.map(({ id, login, avatar_url, html_url, contributions }) => ({
      id,
      login,
      avatar_url,
      html_url,
      contributions,
    }));

    return NextResponse.json(contributors);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
