// /lib/input.ts - Input Sanitization and Validation Library

export interface ValidationResult {
  isValid: boolean
  sanitizedValue: string
  errors: string[]
}

export interface ValidationOptions {
  minLength?: number
  maxLength?: number
  allowSpecialChars?: boolean
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  customPattern?: RegExp
  customPatternMessage?: string
}

/**
 * Sanitizes input by removing dangerous characters and normalizing text
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .trim() // Remove leading/trailing whitespace
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .normalize('NFC') // Unicode normalization
}

/**
 * Sanitizes email input with specific email formatting
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return ''
  }

  return email
    .trim()
    .toLowerCase()
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .normalize('NFC')
}

/**
 * Sanitizes phone number input
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') {
    return ''
  }

  return phone
    .trim()
    .replace(/[^\d\s\-\+\(\)\.]/g, '') // Only allow digits, spaces, and common phone characters
    .normalize('NFC')
}

/**
 * Sanitizes name input (removes numbers and special characters)
 */
export function sanitizeName(name: string): string {
  if (typeof name !== 'string') {
    return ''
  }

  return name
    .trim()
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    .replace(/[<>'"]/g, '')
    .replace(/[0-9]/g, '') // Remove numbers from names
    .replace(/[^\w\s\-'\.]/g, '') // Only allow word characters, spaces, hyphens, apostrophes, dots
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .normalize('NFC')
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  const sanitized = sanitizeEmail(email)
  const errors: string[] = []

  // Basic email regex - more permissive but still secure
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  if (!sanitized) {
    errors.push('Email is required')
  } else if (sanitized.length < 5) {
    errors.push('Email must be at least 5 characters long')
  } else if (sanitized.length > 254) {
    errors.push('Email must be less than 254 characters')
  } else if (!emailRegex.test(sanitized)) {
    errors.push('Please enter a valid email address')
  }

  // Check for suspicious patterns
  if (sanitized.includes('..')) {
    errors.push('Email contains invalid consecutive dots')
  }

  if (sanitized.startsWith('.') || sanitized.endsWith('.')) {
    errors.push('Email cannot start or end with a dot')
  }

  return {
    isValid: errors.length === 0,
    sanitizedValue: sanitized,
    errors
  }
}

/**
 * Validates password with customizable requirements
 */
export function validatePassword(password: string, options: ValidationOptions = {}): ValidationResult {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options

  // Don't sanitize passwords - preserve original for hashing
  const errors: string[] = []

  if (!password) {
    errors.push('Password is required')
    return { isValid: false, sanitizedValue: '', errors }
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  }

  if (password.length > maxLength) {
    errors.push(`Password must be less than ${maxLength} characters`)
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  // Check for common weak patterns
  const weakPatterns = [
    /^(.)\1+$/, // All same character
    /123456|abcdef|qwerty/i, // Common sequences
    /password|admin|user/i, // Common words
  ]

  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common weak patterns')
      break
    }
  }

  return {
    isValid: errors.length === 0,
    sanitizedValue: password, // Keep original password
    errors
  }
}

/**
 * Validates name input
 */
export function validateName(name: string, options: ValidationOptions = {}): ValidationResult {
  const { minLength = 2, maxLength = 50 } = options
  const sanitized = sanitizeName(name)
  const errors: string[] = []

  if (!sanitized) {
    errors.push('Name is required')
  } else if (sanitized.length < minLength) {
    errors.push(`Name must be at least ${minLength} characters long`)
  } else if (sanitized.length > maxLength) {
    errors.push(`Name must be less than ${maxLength} characters`)
  }

  // Check for valid name patterns
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/
  if (sanitized && !nameRegex.test(sanitized)) {
    errors.push('Name can only contain letters, spaces, hyphens, apostrophes, and dots')
  }

  return {
    isValid: errors.length === 0,
    sanitizedValue: sanitized,
    errors
  }
}

/**
 * Validates phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const sanitized = sanitizePhone(phone)
  const errors: string[] = []

  if (!sanitized) {
    errors.push('Phone number is required')
    return { isValid: false, sanitizedValue: '', errors }
  }

  // Remove all non-digit characters for length check
  const digitsOnly = sanitized.replace(/\D/g, '')
  
  if (digitsOnly.length < 10) {
    errors.push('Phone number must contain at least 10 digits')
  } else if (digitsOnly.length > 15) {
    errors.push('Phone number must contain no more than 15 digits')
  }

  // Basic phone format validation (international format allowed)
  const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{10,}$/
  if (!phoneRegex.test(sanitized)) {
    errors.push('Please enter a valid phone number')
  }

  return {
    isValid: errors.length === 0,
    sanitizedValue: sanitized,
    errors
  }
}

/**
 * Rate limiting helper - tracks attempts by identifier
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map()
  private maxAttempts: number
  private windowMs: number

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 15 minutes
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now })
      return true
    }

    // Reset if window has passed
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now })
      return true
    }

    // Increment attempts
    record.count++
    record.lastAttempt = now

    return record.count <= this.maxAttempts
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier)
    if (!record) return 0

    const remaining = this.windowMs - (Date.now() - record.lastAttempt)
    return Math.max(0, remaining)
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}

// Export rate limiter instances
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
export const generalRateLimiter = new RateLimiter(10, 5 * 60 * 1000) // 10 attempts per 5 minutes

/**
 * Comprehensive validation for sign-up form
 */
export function validateSignUpForm(formData: {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}): {
  isValid: boolean
  sanitizedData: Partial<typeof formData>
  errors: Record<string, string[]>
  fieldErrors: Record<string, string>
} {
  const nameValidation = validateName(formData.name)
  const emailValidation = validateEmail(formData.email)
  const passwordValidation = validatePassword(formData.password)
  const phoneValidation = formData.phone ? validatePhone(formData.phone) : { isValid: true, sanitizedValue: '', errors: [] }

  const errors: Record<string, string[]> = {}
  const fieldErrors: Record<string, string> = {}

  if (!nameValidation.isValid) {
    errors.name = nameValidation.errors
    fieldErrors.name = nameValidation.errors[0]
  }

  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors
    fieldErrors.email = emailValidation.errors[0]
  }

  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors
    fieldErrors.password = passwordValidation.errors[0]
  }

  // Validate password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = ['Passwords do not match']
    fieldErrors.confirmPassword = 'Passwords do not match'
  }

  if (formData.phone && !phoneValidation.isValid) {
    errors.phone = phoneValidation.errors
    fieldErrors.phone = phoneValidation.errors[0]
  }

  const isValid = Object.keys(errors).length === 0

  return {
    isValid,
    sanitizedData: {
      name: nameValidation.sanitizedValue,
      email: emailValidation.sanitizedValue,
      password: passwordValidation.sanitizedValue,
      phone: phoneValidation.sanitizedValue || undefined
    },
    errors,
    fieldErrors
  }
}

/**
 * Comprehensive validation for sign-in form
 */
export function validateSignInForm(formData: {
  email: string
  password: string
}): {
  isValid: boolean
  sanitizedData: typeof formData
  errors: Record<string, string[]>
  fieldErrors: Record<string, string>
} {
  const emailValidation = validateEmail(formData.email)
  const errors: Record<string, string[]> = {}
  const fieldErrors: Record<string, string> = {}

  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors
    fieldErrors.email = emailValidation.errors[0]
  }

  if (!formData.password) {
    errors.password = ['Password is required']
    fieldErrors.password = 'Password is required'
  }

  const isValid = Object.keys(errors).length === 0

  return {
    isValid,
    sanitizedData: {
      email: emailValidation.sanitizedValue,
      password: formData.password // Don't sanitize password for sign-in
    },
    errors,
    fieldErrors
  }
}

/**
 * Security helper to detect suspicious input patterns
 */
export function detectSuspiciousInput(input: string): {
  isSuspicious: boolean
  reasons: string[]
} {
  const reasons: string[] = []
  
  // SQL Injection patterns
  if (/(\b(union|select|insert|update|delete|drop|exec|execute)\b)|(-{2})|(\*\/)|\/\*/i.test(input)) {
    reasons.push('Potential SQL injection detected')
  }

  // XSS patterns
  if (/<script|javascript:|on\w+\s*=|<iframe|<object|<embed/i.test(input)) {
    reasons.push('Potential XSS attempt detected')
  }

  // Path traversal
  if (/\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c/i.test(input)) {
    reasons.push('Path traversal attempt detected')
  }

  // Command injection
  if (/[;&|`$(){}[\]]/g.test(input)) {
    reasons.push('Potential command injection detected')
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons
  }
}

/**
 * Generate secure password suggestions
 */
export function generatePasswordSuggestions(count: number = 3): string[] {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const suggestions: string[] = []
  
  for (let i = 0; i < count; i++) {
    let password = ''
    
    // Ensure at least one character from each required category
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += specials[Math.floor(Math.random() * specials.length)]
    
    // Add random characters to reach desired length
    const allChars = uppercase + lowercase + numbers + specials
    for (let j = 4; j < 12; j++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('')
    suggestions.push(password)
  }
  
  return suggestions
}
