export const APP_NAME = 'Proposo'
export const APP_DESCRIPTION = 'AI-powered proposals that win deals. Generate professional proposals in seconds, not hours.'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const PROPOSAL_TEMPLATES = [
  { id: 'general', name: 'General Service', icon: '📋' },
  { id: 'web-development', name: 'Web Development', icon: '💻' },
  { id: 'marketing', name: 'Marketing & Advertising', icon: '📈' },
  { id: 'consulting', name: 'Consulting', icon: '🎯' },
  { id: 'design', name: 'Design & Creative', icon: '🎨' },
  { id: 'construction', name: 'Construction & Renovation', icon: '🏗️' },
  { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
  { id: 'electrical', name: 'Electrical', icon: '⚡' },
  { id: 'hvac', name: 'HVAC', icon: '❄️' },
  { id: 'landscaping', name: 'Landscaping', icon: '🌿' },
  { id: 'cleaning', name: 'Cleaning Services', icon: '✨' },
  { id: 'photography', name: 'Photography & Video', icon: '📷' },
  { id: 'catering', name: 'Catering & Events', icon: '🍽️' },
  { id: 'accounting', name: 'Accounting & Finance', icon: '💰' },
  { id: 'legal', name: 'Legal Services', icon: '⚖️' },
  { id: 'it-services', name: 'IT Services & Support', icon: '🖥️' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { id: 'fitness', name: 'Fitness & Wellness', icon: '💪' },
] as const

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
] as const

export const DEFAULT_CURRENCY = 'USD'

export const PROPOSAL_VALID_DAYS = 30

export const MAX_FREE_PROPOSALS = 3
