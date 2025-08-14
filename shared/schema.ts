import { z } from "zod";
import { pgTable, varchar, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  company: varchar("company"),
  title: varchar("title"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Security assessments table
export const securityAssessments = pgTable("security_assessments", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  companyName: varchar("company_name").notNull(),
  industry: varchar("industry").notNull(),
  companySize: varchar("company_size").notNull(), // small, medium, large, enterprise
  currentSecurityTools: text("current_security_tools").array(), // array of strings
  complianceRequirements: text("compliance_requirements").array(), // GDPR, HIPAA, SOX, etc.
  assessmentData: jsonb("assessment_data").notNull(), // detailed assessment responses
  overallScore: integer("overall_score").notNull(), // 0-100
  riskLevel: varchar("risk_level").notNull(), // low, medium, high, critical
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Security recommendations table
export const securityRecommendations = pgTable("security_recommendations", {
  id: varchar("id").primaryKey(),
  assessmentId: varchar("assessment_id").references(() => securityAssessments.id).notNull(),
  category: varchar("category").notNull(), // access_control, data_protection, network_security, etc.
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  priority: varchar("priority").notNull(), // critical, high, medium, low
  difficulty: varchar("difficulty").notNull(), // easy, medium, hard
  estimatedCost: varchar("estimated_cost"), // free, low, medium, high
  estimatedTimeToImplement: varchar("estimated_time"), // hours, days, weeks, months
  benefits: text("benefits").array(), // array of benefit descriptions
  steps: jsonb("steps").notNull(), // detailed implementation steps
  resources: jsonb("resources"), // links, tools, guides
  isImplemented: boolean("is_implemented").default(false),
  implementationNotes: text("implementation_notes"),
  implementedAt: timestamp("implemented_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Security metrics tracking
export const securityMetrics = pgTable("security_metrics", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  assessmentId: varchar("assessment_id").references(() => securityAssessments.id).notNull(),
  metricType: varchar("metric_type").notNull(), // vulnerability_count, compliance_score, etc.
  value: integer("value").notNull(),
  previousValue: integer("previous_value"),
  changePercentage: integer("change_percentage"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  assessments: many(securityAssessments),
  metrics: many(securityMetrics),
}));

export const securityAssessmentsRelations = relations(securityAssessments, ({ one, many }) => ({
  user: one(users, {
    fields: [securityAssessments.userId],
    references: [users.id],
  }),
  recommendations: many(securityRecommendations),
  metrics: many(securityMetrics),
}));

export const securityRecommendationsRelations = relations(securityRecommendations, ({ one }) => ({
  assessment: one(securityAssessments, {
    fields: [securityRecommendations.assessmentId],
    references: [securityAssessments.id],
  }),
}));

export const securityMetricsRelations = relations(securityMetrics, ({ one }) => ({
  user: one(users, {
    fields: [securityMetrics.userId],
    references: [users.id],
  }),
  assessment: one(securityAssessments, {
    fields: [securityMetrics.assessmentId],
    references: [securityAssessments.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertSecurityAssessmentSchema = createInsertSchema(securityAssessments);
export const insertSecurityRecommendationSchema = createInsertSchema(securityRecommendations);
export const insertSecurityMetricSchema = createInsertSchema(securityMetrics);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SecurityAssessment = typeof securityAssessments.$inferSelect;
export type InsertSecurityAssessment = typeof securityAssessments.$inferInsert;

export type SecurityRecommendation = typeof securityRecommendations.$inferSelect;
export type InsertSecurityRecommendation = typeof securityRecommendations.$inferInsert;

export type SecurityMetric = typeof securityMetrics.$inferSelect;
export type InsertSecurityMetric = typeof securityMetrics.$inferInsert;