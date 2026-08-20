import { pgTable, serial, text, timestamp, boolean, varchar, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  image: text('image'),
  role: varchar('role', { length: 50 }).default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  imageUrl: text('image_url').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  isApproved: boolean('is_approved').default(false).notNull(), // For moderation
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
