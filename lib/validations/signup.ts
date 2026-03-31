import { z } from 'zod'

// Password must have: 8+ chars, 1 uppercase, 1 special character
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  )

// Username: alphanumeric, underscores, 3-20 chars
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  )

// Full name validation
const fullNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

// Date of birth - must be between 13 and 50 years old (realistic for football)
const dateOfBirthSchema = z.string().refine(
  (date) => {
    const dob = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())
        ? age - 1
        : age
    return actualAge >= 13 && actualAge <= 50
  },
  { message: 'You must be between 13 and 50 years old' }
)

// Email validation
const emailSchema = z.string().email('Please enter a valid email address')

// Phone validation (basic - will be enhanced with country code)
const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^\+?[0-9\s-]+$/, 'Please enter a valid phone number')

// Main signup schema for email-based signup
export const signupWithEmailSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    username: usernameSchema,
    dateOfBirth: dateOfBirthSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: 'You must accept the privacy policy to continue',
    }),
    contactMethod: z.literal('email'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Main signup schema for phone-based signup
export const signupWithPhoneSchema = z
  .object({
    fullName: fullNameSchema,
    phone: phoneSchema,
    countryCode: z.string().min(1, 'Please select a country code'),
    username: usernameSchema,
    dateOfBirth: dateOfBirthSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: 'You must accept the privacy policy to continue',
    }),
    contactMethod: z.literal('phone'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Combined schema type
export type SignupWithEmailData = z.infer<typeof signupWithEmailSchema>
export type SignupWithPhoneData = z.infer<typeof signupWithPhoneSchema>
export type SignupData = SignupWithEmailData | SignupWithPhoneData

// Helper to calculate age group based on DOB
export function calculateAgeGroup(dateOfBirth: string): string {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }

  if (age < 15) return 'U15'
  if (age < 17) return 'U17'
  if (age < 19) return 'U19'
  if (age < 21) return 'U21'
  if (age < 23) return 'U23'
  return 'Senior'
}

// Password strength checker
export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

  if (score <= 2) return { score, label: 'Weak', color: 'bg-destructive' }
  if (score <= 4) return { score, label: 'Medium', color: 'bg-warning' }
  return { score, label: 'Strong', color: 'bg-success' }
}
