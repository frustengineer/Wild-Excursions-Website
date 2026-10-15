const SITE = 'https://wildexcursions.in';

export const teamMembers = [
  { slug: 'hardik-patel', name: 'Hardik Patel', role: 'Founder', nickname: 'The Route Planner' },
  { slug: 'abhay-gupta', name: 'Abhay Gupta', role: 'Marketing Head', nickname: 'The Storyteller' },
  { slug: 'tejas-paliya', name: 'Tejas Paliya', role: 'Technology Head', nickname: 'The Code Whisperer' },
  { slug: 'nagendra-soni', name: 'Nagendra Soni', role: 'Sales Head', nickname: 'The Closer' },
  { slug: 'harish-sontake', name: 'Harish Sontake', role: 'Video Editor', nickname: 'The Frame Chaser' },
] as const;

/** Default expert byline for articles without a named author. */
export const DEFAULT_AUTHOR = 'Hardik Patel';

/** Team member for a byline name; unknown or team-style names fall back to the default expert. */
export const authorFor = (name?: string) =>
  teamMembers.find((m) => m.name === name) ?? teamMembers.find((m) => m.name === DEFAULT_AUTHOR)!;

/** schema.org Person linked to the person's card on /about/. */
export function personSchema(name?: string, jobTitle?: string) {
  const member = authorFor(name);
  const url = `${SITE}/about/#${member.slug}`;
  return {
    '@type': 'Person',
    '@id': url,
    name: member.name,
    jobTitle: member.name === name && jobTitle ? jobTitle : member.role,
    url,
    worksFor: { '@id': `${SITE}/#organization` },
  };
}
