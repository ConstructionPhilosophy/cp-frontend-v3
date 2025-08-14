import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  title: text("title"),
  company: text("company"),
  avatar: text("avatar"),
  bio: text("bio"),
  posts: integer("posts").default(0),
  views: integer("views").default(0),
  thanks: integer("thanks").default(0),
  insightful: integer("insightful").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull().references(() => users.id),
  category: text("category"),
  tags: text("tags").array(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const answers = pgTable("answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  questionId: varchar("question_id").notNull().references(() => questions.id),
  authorId: varchar("author_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const spaces = pgTable("spaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  hashtag: text("hashtag").notNull(),
  count: integer("count").default(0),
  isActive: boolean("is_active").default(false),
});

export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location"),
  initials: text("initials").notNull(),
  color: text("color").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertAnswerSchema = createInsertSchema(answers).omit({
  id: true,
  createdAt: true,
});

export const insertSpaceSchema = createInsertSchema(spaces).omit({
  id: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type Space = typeof spaces.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type InsertSpace = z.infer<typeof insertSpaceSchema>;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
