import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const scholarshipApplications = pgTable("scholarship_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  educationLevel: text("education_level").notNull(),
  casteCategory: text("caste_category").notNull(),
  incomeLevel: text("income_level").notNull(),
  eligibleScholarships: jsonb("eligible_scholarships"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const whatsappSubscriptions = pgTable("whatsapp_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull().unique(),
  isActive: boolean("is_active").default(true),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const helpCenters = pgTable("help_centers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'bank', 'csc', 'uidai'
  address: text("address").notNull(),
  phoneNumber: text("phone_number"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  pincode: text("pincode"),
  services: jsonb("services"),
});

export const gamificationProgress = pgTable("gamification_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  quizScores: jsonb("quiz_scores"),
  badges: jsonb("badges"),
  level: integer("level").default(1),
  totalPoints: integer("total_points").default(0),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  message: text("message").notNull(),
  response: text("response"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScholarshipApplicationSchema = createInsertSchema(scholarshipApplications).omit({
  id: true,
  createdAt: true,
});

export const insertWhatsappSubscriptionSchema = createInsertSchema(whatsappSubscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertHelpCenterSchema = createInsertSchema(helpCenters).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ScholarshipApplication = typeof scholarshipApplications.$inferSelect;
export type WhatsappSubscription = typeof whatsappSubscriptions.$inferSelect;
export type HelpCenter = typeof helpCenters.$inferSelect;
export type GamificationProgress = typeof gamificationProgress.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertScholarshipApplication = z.infer<typeof insertScholarshipApplicationSchema>;
export type InsertWhatsappSubscription = z.infer<typeof insertWhatsappSubscriptionSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
