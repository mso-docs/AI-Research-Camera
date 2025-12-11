import { User } from '../types';

const USERS_KEY = 'arc_users';
const SESSION_KEY = 'arc_session';

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeEmail = (email: string) => email.toLowerCase().trim();

export const authService = {
  async login(email: string, password: string): Promise<User> {
    await delay(600);
    
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {
      console.error("Error parsing users from storage", e);
      users = [];
    }

    const normalizedEmail = normalizeEmail(email);
    const user = users.find((u: any) => normalizeEmail(u.email) === normalizedEmail && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const sessionUser = { id: user.id, email: user.email, name: user.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async signup(email: string, password: string, name: string): Promise<User> {
    await delay(600);
    
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {
      users = [];
    }
    
    const normalizedEmail = normalizeEmail(email);

    if (users.find((u: any) => normalizeEmail(u.email) === normalizedEmail)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail, // Store normalized email
      password,
      name
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const sessionUser = { id: newUser.id, email: newUser.email, name: newUser.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  }
};