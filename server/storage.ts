import { 
  type User, 
  type InsertUser, 
  type ScholarshipApplication,
  type InsertScholarshipApplication,
  type WhatsappSubscription,
  type InsertWhatsappSubscription,
  type HelpCenter,
  type GamificationProgress,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createScholarshipApplication(app: InsertScholarshipApplication): Promise<ScholarshipApplication>;
  getScholarshipApplicationsByUser(userId: string): Promise<ScholarshipApplication[]>;
  
  createWhatsappSubscription(sub: InsertWhatsappSubscription): Promise<WhatsappSubscription>;
  getWhatsappSubscription(phoneNumber: string): Promise<WhatsappSubscription | undefined>;
  
  getHelpCenters(pincode?: string, type?: string): Promise<HelpCenter[]>;
  
  getGamificationProgress(userId: string): Promise<GamificationProgress | undefined>;
  updateGamificationProgress(userId: string, progress: Partial<GamificationProgress>): Promise<GamificationProgress>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(userId: string): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scholarshipApplications: Map<string, ScholarshipApplication>;
  private whatsappSubscriptions: Map<string, WhatsappSubscription>;
  private helpCenters: Map<string, HelpCenter>;
  private gamificationProgress: Map<string, GamificationProgress>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.scholarshipApplications = new Map();
    this.whatsappSubscriptions = new Map();
    this.helpCenters = new Map();
    this.gamificationProgress = new Map();
    this.chatMessages = new Map();
    
    // Initialize some help centers data
    this.initializeHelpCenters();
  }

  private initializeHelpCenters() {
    const centers: HelpCenter[] = [
      {
        id: randomUUID(),
        name: "State Bank of India - Main Branch",
        type: "bank",
        address: "Gandhi Maidan, Patna, Bihar 800001",
        phoneNumber: "0612-2234567",
        latitude: "25.6093",
        longitude: "85.1376",
        pincode: "800001",
        services: ["aadhaar_seeding", "dbt_verification", "account_opening"]
      },
      {
        id: randomUUID(),
        name: "Common Service Center",
        type: "csc",
        address: "Boring Road, Patna, Bihar 800013",
        phoneNumber: "9876543210",
        latitude: "25.5941",
        longitude: "85.1376",
        pincode: "800013",
        services: ["aadhaar_seeding", "digital_services"]
      },
      {
        id: randomUUID(),
        name: "UIDAI Enrollment Center",
        type: "uidai",
        address: "Kankarbagh, Patna, Bihar 800020",
        phoneNumber: "0612-2345678",
        latitude: "25.5744",
        longitude: "85.0960",
        pincode: "800020",
        services: ["aadhaar_enrollment", "aadhaar_update"]
      }
    ];

    centers.forEach(center => {
      this.helpCenters.set(center.id, center);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createScholarshipApplication(app: InsertScholarshipApplication): Promise<ScholarshipApplication> {
    const id = randomUUID();
    const application: ScholarshipApplication = { 
      ...app, 
      id, 
      userId: app.userId || null,
      createdAt: new Date() 
    };
    this.scholarshipApplications.set(id, application);
    return application;
  }

  async getScholarshipApplicationsByUser(userId: string): Promise<ScholarshipApplication[]> {
    return Array.from(this.scholarshipApplications.values()).filter(
      (app) => app.userId === userId
    );
  }

  async createWhatsappSubscription(sub: InsertWhatsappSubscription): Promise<WhatsappSubscription> {
    const id = randomUUID();
    const subscription: WhatsappSubscription = { 
      ...sub, 
      id, 
      isActive: sub.isActive ?? true,
      createdAt: new Date() 
    };
    this.whatsappSubscriptions.set(id, subscription);
    return subscription;
  }

  async getWhatsappSubscription(phoneNumber: string): Promise<WhatsappSubscription | undefined> {
    return Array.from(this.whatsappSubscriptions.values()).find(
      (sub) => sub.phoneNumber === phoneNumber
    );
  }

  async getHelpCenters(pincode?: string, type?: string): Promise<HelpCenter[]> {
    let centers = Array.from(this.helpCenters.values());
    
    if (pincode) {
      centers = centers.filter(center => center.pincode === pincode);
    }
    
    if (type) {
      centers = centers.filter(center => center.type === type);
    }
    
    return centers;
  }

  async getGamificationProgress(userId: string): Promise<GamificationProgress | undefined> {
    return Array.from(this.gamificationProgress.values()).find(
      (progress) => progress.userId === userId
    );
  }

  async updateGamificationProgress(userId: string, progressUpdate: Partial<GamificationProgress>): Promise<GamificationProgress> {
    const existing = await this.getGamificationProgress(userId);
    
    const progress: GamificationProgress = existing ? 
      { ...existing, ...progressUpdate } : 
      { 
        id: randomUUID(), 
        userId, 
        quizScores: null,
        badges: null,
        level: 1,
        totalPoints: 0,
        ...progressUpdate 
      };
    
    this.gamificationProgress.set(progress.id, progress);
    return progress;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = { 
      ...message, 
      id, 
      userId: message.userId || null,
      response: message.response || null,
      timestamp: new Date() 
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.userId === userId)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }
}

export const storage = new MemStorage();
