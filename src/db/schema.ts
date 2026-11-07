import { pgTable, serial, text, boolean, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const HUBS = ['about', 'work', 'skills', 'contact'] as const;
export type Hub = (typeof HUBS)[number];

// Single admin account, created by `npm run seed`. No public signup.
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  totpSecret: text('totp_secret'),
  totpEnabled: boolean('totp_enabled').notNull().default(false),
  // bumped on password change / logout-everywhere so old session tokens die
  sessionVersion: integer('session_version').notNull().default(0),
});

// Every star in the constellation is a node; the hub says which cluster it belongs to.
export const nodes = pgTable('nodes', {
  id: serial('id').primaryKey(),
  hub: text('hub').$type<Hub>().notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull().default(''),
  body: text('body').notNull().default(''),
  url: text('url').notNull().default(''),
  imageUrl: text('image_url').notNull().default(''),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  published: boolean('published').notNull().default(true),
  position: integer('position').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type HubConfig = { name: string; blurb: string; color: string };
export const settings = pgTable('settings', {
  id: integer('id').primaryKey().default(1),
  siteName: text('site_name').notNull().default('Your Name'),
  tagline: text('tagline').notNull().default(''),
  resumeUrl: text('resume_url').notNull().default(''),
  hubs: jsonb('hubs').$type<Record<Hub, HubConfig>>().notNull(),
});

export const loginAttempts = pgTable('login_attempts', {
  id: serial('id').primaryKey(),
  key: text('key').notNull(),
  at: timestamp('at').notNull().defaultNow(),
});
