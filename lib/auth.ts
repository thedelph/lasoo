export interface LocksmithUser {
  id: string
  email: string
  companyName: string
}

export interface WorkingHours {
  [key: string]: {
    start: string
    end: string
  }
}

export interface Services {
  [key: string]: {
    offered: boolean
    price: string
  }
}

export interface Address {
  line1: string
  line2: string
  town: string
  city: string
  county: string
  postcode: string
  country: string
}

// Mock user database - in a real app, this would be in a proper database
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    companyName: 'Test Locksmith Ltd'
  }
]

export async function loginLocksmith(email: string, password: string): Promise<LocksmithUser> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const user = MOCK_USERS.find(u => u.email === email && u.password === password)
  
  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Store user data in localStorage
  localStorage.setItem('locksmithId', user.id)
  localStorage.setItem('locksmithEmail', user.email)
  localStorage.setItem('locksmithCompany', user.companyName)

  return {
    id: user.id,
    email: user.email,
    companyName: user.companyName
  }
}

export async function registerLocksmith(email: string, password: string, companyName: string): Promise<void> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Check if user already exists
  if (MOCK_USERS.some(u => u.email === email)) {
    throw new Error('Email already registered')
  }

  // In a real app, this would add to a database
  MOCK_USERS.push({
    id: String(MOCK_USERS.length + 1),
    email,
    password,
    companyName
  })
}

export async function updateLocksmith(id: number, data: any) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true }
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('locksmithId')
}

export function getCurrentUser(): LocksmithUser | null {
  if (typeof window === 'undefined') return null
  const id = localStorage.getItem('locksmithId')
  if (!id) return null
  
  return {
    id,
    email: localStorage.getItem('locksmithEmail') || '',
    companyName: localStorage.getItem('locksmithCompany') || ''
  }
}