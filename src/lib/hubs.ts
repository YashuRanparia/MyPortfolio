import type { Hub, HubConfig } from '../db/schema';

export const DEFAULT_HUBS: Record<Hub, HubConfig> = {
  about: { name: 'About', color: '#ffcf6b', blurb: 'The person behind the stars.' },
  work: { name: 'Work', color: '#7ee0ff', blurb: 'Selected projects. Click a star to read the story behind it.' },
  skills: { name: 'Skills', color: '#c79bff', blurb: 'Tools I reach for, grouped by how I use them.' },
  contact: { name: 'Contact', color: '#ff8fa3', blurb: "Let's build something." },
};

// What each field means per hub, shown as hints in the admin form.
export const HINTS: Record<Hub, { title: string; summary: string; url: string; tags: string }> = {
  about: { title: 'Topic, e.g. "Origin"', summary: 'One-line teaser', url: 'Optional link', tags: 'Optional' },
  work: { title: 'Project name', summary: 'One-line pitch', url: 'Live / repo link', tags: 'Tech stack, comma separated' },
  skills: { title: 'Skill group, e.g. "Backend"', summary: 'One-line description', url: 'Optional', tags: 'The skills in this group, comma separated' },
  contact: { title: 'Label, e.g. "Email"', summary: 'Display text, e.g. you@site.com', url: 'mailto:… or https://…', tags: 'Optional' },
};
