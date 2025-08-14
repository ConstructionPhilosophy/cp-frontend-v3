import { type User, type InsertUser, type Question, type InsertQuestion, type Answer, type InsertAnswer, type Space, type InsertSpace, type Vendor, type InsertVendor } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Questions
  getQuestion(id: string): Promise<Question | undefined>;
  getAllQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestionsByUser(userId: string): Promise<Question[]>;

  // Answers
  getAnswer(id: string): Promise<Answer | undefined>;
  getAnswersByQuestion(questionId: string): Promise<Answer[]>;
  createAnswer(answer: InsertAnswer): Promise<Answer>;

  // Spaces
  getAllSpaces(): Promise<Space[]>;
  createSpace(space: InsertSpace): Promise<Space>;

  // Vendors
  getAllVendors(): Promise<Vendor[]>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questions: Map<string, Question>;
  private answers: Map<string, Answer>;
  private spaces: Map<string, Space>;
  private vendors: Map<string, Vendor>;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.answers = new Map();
    this.spaces = new Map();
    this.vendors = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed with mock data for demonstration
    const mockUsers = [
      {
        id: "1",
        username: "jennifer.smith",
        name: "Jennifer Smith",
        title: "Brand at Modern Media",
        company: "Modern Media",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        bio: "Marketing professional with 10+ years experience",
        posts: 15,
        views: 2500,
        thanks: 45,
        insightful: 32,
        createdAt: new Date("2023-01-15"),
      },
      {
        id: "2",
        username: "eckart.walther",
        name: "Eckart Walther",
        title: "CMO at Modern Media",
        company: "Modern Media",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        bio: "Chief Marketing Officer specializing in B2B growth",
        posts: 43,
        views: 4300,
        thanks: 105,
        insightful: 342,
        createdAt: new Date("2022-03-10"),
      },
    ];

    mockUsers.forEach(user => this.users.set(user.id, user));
  }

  // Users
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
    const user: User = { 
      ...insertUser, 
      id,
      posts: 0,
      views: 0,
      thanks: 0,
      insightful: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Questions
  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = { 
      ...insertQuestion, 
      id,
      createdAt: new Date()
    };
    this.questions.set(id, question);
    return question;
  }

  async getQuestionsByUser(userId: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      question => question.authorId === userId
    );
  }

  // Answers
  async getAnswer(id: string): Promise<Answer | undefined> {
    return this.answers.get(id);
  }

  async getAnswersByQuestion(questionId: string): Promise<Answer[]> {
    return Array.from(this.answers.values()).filter(
      answer => answer.questionId === questionId
    );
  }

  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const id = randomUUID();
    const answer: Answer = { 
      ...insertAnswer, 
      id,
      createdAt: new Date()
    };
    this.answers.set(id, answer);
    return answer;
  }

  // Spaces
  async getAllSpaces(): Promise<Space[]> {
    return Array.from(this.spaces.values());
  }

  async createSpace(insertSpace: InsertSpace): Promise<Space> {
    const id = randomUUID();
    const space: Space = { ...insertSpace, id };
    this.spaces.set(id, space);
    return space;
  }

  // Vendors
  async getAllVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = randomUUID();
    const vendor: Vendor = { ...insertVendor, id };
    this.vendors.set(id, vendor);
    return vendor;
  }
}

export const storage = new MemStorage();
