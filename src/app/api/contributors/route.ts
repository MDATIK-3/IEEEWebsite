import { NextResponse } from 'next/server';
import roles from '@/data/ContributionRoles.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'MDATIK-3';
const REPO_NAME = 'IEEEWebsite';
const TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

async function fetchGitHub(url: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'IEEE-Website',
  };
  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  const res = await fetch(url, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorMap: Record<number, string> = {
      401: 'Invalid GitHub token',
      403: 'API rate limit exceeded or insufficient permissions',
      404: 'Repository not found',
    };
    throw new Error(errorMap[res.status] || `GitHub API error: ${res.status}`);
  }

  return res.json();
}

const buildFallbackContributors = () =>
  roles.map((role, index) => ({
    id: index + 1,
    login: role.login,
    avatar_url: role.avatar_url || (role.login ? `https://avatars.githubusercontent.com/${role.login}` : ''),
    html_url: role.github || (role.login ? `https://github.com/${role.login}` : ''),
    contributions: null,
    name: role.name || role.login,
    developer_type: role.developer_type || 'Developer',
    batch: role.batch || '',
    facebook: role.facebook || '',
    linkedin: role.linkedin || '',
    email: role.email || '',
    bio: role.bio || '',
    public_repos: 0,
    avatar_updated_at: Date.now(),
  }));

export async function GET() {
  try {
    let contributorsData;
    try {
      contributorsData = await fetchGitHub(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contributors`
      );
    } catch (err) {
      console.warn('Falling back to local contributors data:', err);
      return NextResponse.json(buildFallbackContributors(), {
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    if (!Array.isArray(contributorsData)) {
      throw new Error('Invalid data format from GitHub API');
    }

    const rolesMap = roles.reduce<Record<string, typeof roles[0]>>(
      (map, role) => {
        map[role.login] = role;
        return map;
      },
      {}
    );

    const contributors = await Promise.all(
      contributorsData.map(async ({ id, login, avatar_url, html_url, contributions }) => {
        const baseData = {
          id,
          login,
          avatar_url,
          html_url,
          contributions,
          name: login,
          developer_type: contributions > 150 ? 'Senior Developer' : 'Developer',
          batch: '',
          facebook: '',
          linkedin: '',
          email: '',
          bio: '',
          public_repos: 0,
          avatar_updated_at: Date.now(), 
        };

        const role = rolesMap[login];
        const contributorData = role
          ? { ...baseData, ...role, developer_type: role.developer_type || baseData.developer_type }
          : baseData;

        try {
          const userData = await fetchGitHub(`${GITHUB_API_BASE}/users/${login}`);
          contributorData.name = contributorData.name || userData.name;
          contributorData.avatar_url = userData.avatar_url || baseData.avatar_url;
          contributorData.avatar_updated_at = new Date(userData.updated_at).getTime() || Date.now();
        } catch (err: unknown) {
          console.warn(`Error fetching GitHub user data for ${login}:`, err);
        }

        return contributorData;
      })
    );

    return NextResponse.json(contributors, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    let message = 'Internal server error';
    if (err instanceof Error) message = err.message;

    console.error('API error:', message);
    return NextResponse.json(buildFallbackContributors(), {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }
}
