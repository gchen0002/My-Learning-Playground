export type TemplateId = '1' | '2' | '3' | '4' | '5';
export type ColorMode = 'light' | 'dark';

export type Template = {
  id: TemplateId;
  name: string;
  description: string;
};

export const templates: Template[] = [
  {
    id: '1',
    name: 'Library Desk',
    description: 'Soft, quiet, and notebook-like.',
  },
  {
    id: '2',
    name: 'Terminal Notes',
    description: 'Compact, code-adjacent, and focused.',
  },
  {
    id: '3',
    name: 'Paper Stack',
    description: 'Plain document surfaces with calm contrast.',
  },
  {
    id: '4',
    name: 'Studio Board',
    description: 'Clean panels with a slightly editorial feel.',
  },
  {
    id: '5',
    name: 'Quiet Console',
    description: 'Dense, practical, and dashboard-like.',
  },
];

export function getTemplateFromPath(pathname: string): TemplateId {
  const routedPath = new URLSearchParams(window.location.search).get('route') ?? pathname;
  const match = routedPath.match(/\/([1-5])\/?$/);
  return (match?.[1] as TemplateId | undefined) ?? '1';
}
