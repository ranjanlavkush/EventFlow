import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScholarshipApplicationSchema, insertWhatsappSubscriptionSchema, insertChatMessageSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Scholarship eligibility endpoint
  app.post("/api/check-eligibility", async (req, res) => {
    try {
      const data = insertScholarshipApplicationSchema.parse(req.body);
      
      // Mock scholarship matching logic
      const scholarships = [];
      
      if (data.educationLevel === "pre-matric") {
        scholarships.push({
          name: "Pre-Matric Scholarship for SC/ST Students",
          amount: "₹1,200-₹12,000",
          deadline: "2024-03-31",
          eligible: ["sc", "st"].includes(data.casteCategory.toLowerCase())
        });
      }
      
      if (data.educationLevel === "post-matric") {
        scholarships.push({
          name: "Post-Matric Scholarship for SC/ST Students", 
          amount: "₹15,000-₹85,000",
          deadline: "2024-04-30",
          eligible: ["sc", "st"].includes(data.casteCategory.toLowerCase())
        });
      }
      
      if (data.incomeLevel === "below-2-lakh") {
        scholarships.push({
          name: "Merit-cum-Means Scholarship",
          amount: "₹20,000-₹50,000", 
          deadline: "2024-05-15",
          eligible: true
        });
      }
      
      const eligibleScholarships = scholarships.filter(s => s.eligible);
      
      const application = await storage.createScholarshipApplication({
        ...data,
        eligibleScholarships: eligibleScholarships
      });
      
      res.json({ success: true, scholarships: eligibleScholarships, applicationId: application.id });
    } catch (error) {
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  // WhatsApp subscription endpoint
  app.post("/api/subscribe-whatsapp", async (req, res) => {
    try {
      const data = insertWhatsappSubscriptionSchema.parse(req.body);
      
      // Check if already subscribed
      const existing = await storage.getWhatsappSubscription(data.phoneNumber);
      if (existing) {
        return res.json({ success: true, message: "Already subscribed" });
      }
      
      const subscription = await storage.createWhatsappSubscription(data);
      res.json({ success: true, subscription });
    } catch (error) {
      res.status(400).json({ error: "Invalid phone number" });
    }
  });

  // Help centers endpoint
  app.get("/api/help-centers", async (req, res) => {
    try {
      const { pincode, type } = req.query;
      const centers = await storage.getHelpCenters(
        pincode as string, 
        type as string
      );
      res.json(centers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch help centers" });
    }
  });

  // Chat with AI assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const data = insertChatMessageSchema.parse(req.body);
      
      // Get AI response from OpenAI
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a helpful scholarship assistant for Indian students. Help them with Aadhaar seeding, DBT processes, and scholarship applications. Be concise and practical."
          },
          {
            role: "user", 
            content: data.message
          }
        ],
        response_format: { type: "json_object" }
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{"response": "I apologize, but I could not process your request."}');
      
      const chatMessage = await storage.createChatMessage({
        ...data,
        response: aiResponse.response
      });
      
      res.json({ response: aiResponse.response, messageId: chatMessage.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Gamification endpoints
  app.post("/api/quiz-score", async (req, res) => {
    try {
      const { userId, score, quizType } = req.body;
      
      const existing = await storage.getGamificationProgress(userId);
      const newQuizScores = existing?.quizScores ? 
        { ...existing.quizScores, [quizType]: score } : 
        { [quizType]: score };
      
      const newBadges = [];
      if (score >= 80) newBadges.push(`${quizType}_expert`);
      if (score >= 60) newBadges.push(`${quizType}_proficient`);
      
      const progress = await storage.updateGamificationProgress(userId, {
        quizScores: newQuizScores,
        badges: newBadges,
        totalPoints: (existing?.totalPoints || 0) + score
      });
      
      res.json({ success: true, progress });
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  app.get("/api/gamification/:userId", async (req, res) => {
    try {
      const progress = await storage.getGamificationProgress(req.params.userId);
      res.json(progress || { level: 1, totalPoints: 0, badges: [], quizScores: {} });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
