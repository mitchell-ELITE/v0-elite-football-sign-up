'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, User, Calendar, AtSign, Check, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { PasswordInput } from '@/components/signup/password-input'
import { PhoneInput } from '@/components/signup/phone-input'
import { RoleToggle } from '@/components/signup/role-toggle'
import { calculateAgeGroup } from '@/lib/validations/signup'

// SVG Football Icon
function FootballIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M12 2C12 2 14.5 6 14.5 12C14.5 18 12 22 12 22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 2C12 2 9.5 6 9.5 12C9.5 18 12 22 12 22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M2 12H22"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 7H20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M4 17H20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
    </svg>
  )
}

// Schema for email signup
const emailSignupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    email: z.string().email('Please enter a valid email address'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    dateOfBirth: z.string().refine(
      (date) => {
        if (!date) return false
        const dob = new Date(date)
        const today = new Date()
        let age = today.getFullYear() - dob.getFullYear()
        const monthDiff = today.getMonth() - dob.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--
        }
        return age >= 13 && age <= 50
      },
      { message: 'You must be between 13 and 50 years old' }
    ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: 'You must accept the privacy policy to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Schema for phone signup
const phoneSignupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    countryCode: z.string(),
    dialCode: z.string(),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    dateOfBirth: z.string().refine(
      (date) => {
        if (!date) return false
        const dob = new Date(date)
        const today = new Date()
        let age = today.getFullYear() - dob.getFullYear()
        const monthDiff = today.getMonth() - dob.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--
        }
        return age >= 13 && age <= 50
      },
      { message: 'You must be between 13 and 50 years old' }
    ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: 'You must accept the privacy policy to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type EmailFormData = z.infer<typeof emailSignupSchema>
type PhoneFormData = z.infer<typeof phoneSignupSchema>

export function SignupDetailsClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const method = searchParams.get('method') || 'email'
  
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<'player' | 'scout'>('player')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Async validation states
  const [emailChecking, setEmailChecking] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const isPhone = method === 'phone'

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSignupSchema),
    defaultValues: {
      privacyConsent: false,
    },
    mode: 'onChange',
  })

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSignupSchema),
    defaultValues: {
      privacyConsent: false,
      countryCode: 'US',
      dialCode: '+1',
    },
    mode: 'onChange',
  })

  const form = isPhone ? phoneForm : emailForm
  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = form

  const password = watch('password')
  const dateOfBirth = watch('dateOfBirth')
  const email = !isPhone ? (watch as typeof emailForm.watch)('email') : undefined
  const username = watch('username')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Debounced email check
  const checkEmailAvailability = useCallback(async (emailValue: string) => {
    if (!emailValue || !z.string().email().safeParse(emailValue).success) {
      setEmailAvailable(null)
      return
    }

    setEmailChecking(true)
    try {
      const response = await fetch(`/api/check-email?email=${encodeURIComponent(emailValue)}`)
      const data = await response.json()
      setEmailAvailable(data.available)
    } catch {
      setEmailAvailable(null)
    } finally {
      setEmailChecking(false)
    }
  }, [])

  // Debounced username check
  const checkUsernameAvailability = useCallback(async (usernameValue: string) => {
    if (!usernameValue || usernameValue.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setUsernameChecking(true)
    try {
      const response = await fetch(`/api/check-username?username=${encodeURIComponent(usernameValue)}`)
      const data = await response.json()
      setUsernameAvailable(data.available)
    } catch {
      setUsernameAvailable(null)
    } finally {
      setUsernameChecking(false)
    }
  }, [])

  const onSubmit = async (data: EmailFormData | PhoneFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role,
          contactMethod: isPhone ? 'phone' : 'email',
          ageGroup: data.dateOfBirth ? calculateAgeGroup(data.dateOfBirth) : null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.')
      }

      setSubmitSuccess(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (submitSuccess) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/stadium-bg.jpg)' }}
        >
          <div className="absolute inset-0 bg-background/95" />
          <div className="absolute inset-0 pitch-grid opacity-5" />
        </div>

        {/* Animated Orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md"
        >
          <div className="glass-premium p-8">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto"
              >
                <Check className="w-8 h-8 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground">Profile Created!</h2>
              <p className="text-muted-foreground">
                {isPhone 
                  ? 'We have sent you a verification code via SMS. Please verify your phone number to access your dashboard.'
                  : 'We have sent you a confirmation email. Please verify your email to access your dashboard.'
                }
              </p>
              {dateOfBirth && (
                <p className="text-sm text-primary font-medium">
                  Age Group: {calculateAgeGroup(dateOfBirth as string)}
                </p>
              )}
              <Button
                className="w-full h-12 btn-premium-primary rounded-xl"
                onClick={() => router.push('/login')}
              >
                Continue to Login
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background Image with Fallback */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/stadium-bg.jpg)' }}
      >
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute inset-0 pitch-grid opacity-5" />
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        {/* Premium Glassmorphism Card */}
        <div className="glass-premium overflow-hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-40 pointer-events-none" />

          <div className="relative p-8 sm:p-10">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <FootballIcon className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary uppercase">
                  {isPhone ? 'Phone Sign Up' : 'Email Sign Up'}
                </span>
              </div>
            </motion.div>

        {/* Header */}
        <div className="mb-8">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-6"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              {method === 'email'
                ? 'Create Account'
                : method === 'phone'
                  ? 'Verify Phone'
                  : 'Account Details'}
            </h1>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-balance"
          >
            {method === 'email'
              ? 'Set up your profile in 2 minutes'
              : 'Complete your profile information'}
          </motion.p>
        </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Role Toggle */}
              <RoleToggle value={role} onChange={setRole} disabled={isSubmitting} />

              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder="Enter your full name"
                    className={cn(
                      'h-11 pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground',
                      errors.fullName && 'border-destructive focus-visible:ring-destructive/50'
                    )}
                    aria-invalid={!!errors.fullName}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email or Phone */}
              <AnimatePresence mode="wait">
                {!isPhone ? (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-1.5"
                  >
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        {...(register as typeof emailForm.register)('email')}
                        placeholder="Enter your email"
                        className={cn(
                          'h-11 pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground',
                          (errors as typeof emailForm.formState.errors).email && 'border-destructive focus-visible:ring-destructive/50',
                          emailAvailable === false && 'border-destructive'
                        )}
                        onBlur={(e) => checkEmailAvailability(e.target.value)}
                        aria-invalid={!!(errors as typeof emailForm.formState.errors).email || emailAvailable === false}
                      />
                      {emailChecking && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                      )}
                      {!emailChecking && emailAvailable === true && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      )}
                    </div>
                    {(errors as typeof emailForm.formState.errors).email && (
                      <p className="text-xs text-destructive">{(errors as typeof emailForm.formState.errors).email?.message}</p>
                    )}
                    {emailAvailable === false && (
                      <p className="text-xs text-destructive">
                        This email is already registered. Try signing in instead.
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-1.5"
                  >
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <PhoneInput
                      value={(watch as typeof phoneForm.watch)('phone') || ''}
                      countryCode={(watch as typeof phoneForm.watch)('countryCode') || 'US'}
                      onPhoneChange={(phone) => (setValue as typeof phoneForm.setValue)('phone', phone)}
                      onCountryChange={(code, dialCode) => {
                        (setValue as typeof phoneForm.setValue)('countryCode', code);
                        (setValue as typeof phoneForm.setValue)('dialCode', dialCode)
                      }}
                      error={(errors as typeof phoneForm.formState.errors).phone?.message}
                    />
                    <p className="text-xs text-muted-foreground">
                      We will send you a verification code via SMS
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    {...register('username')}
                    placeholder="Choose a username"
                    className={cn(
                      'h-11 pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground',
                      errors.username && 'border-destructive focus-visible:ring-destructive/50',
                      usernameAvailable === false && 'border-destructive'
                    )}
                    onBlur={(e) => checkUsernameAvailability(e.target.value)}
                    aria-invalid={!!errors.username || usernameAvailable === false}
                  />
                  {usernameChecking && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                  )}
                  {!usernameChecking && usernameAvailable === true && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  )}
                </div>
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username.message}</p>
                )}
                {usernameAvailable === false && (
                  <p className="text-xs text-destructive">
                    This username is taken. Please choose another one.
                  </p>
                )}
                {username && !errors.username && usernameAvailable !== false && (
                  <p className="text-xs text-muted-foreground">
                    footballmarket.com/{username}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                    className={cn(
                      'h-11 pl-10 bg-input border-border text-foreground [color-scheme:dark]',
                      errors.dateOfBirth && 'border-destructive focus-visible:ring-destructive/50'
                    )}
                    aria-invalid={!!errors.dateOfBirth}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
                )}
                {dateOfBirth && !errors.dateOfBirth && (
                  <p className="text-xs text-primary">
                    Age Group: {calculateAgeGroup(dateOfBirth as string)}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <PasswordInput
                  value={password || ''}
                  onChange={(value) => {
                    setValue('password', value)
                    trigger('password')
                  }}
                  error={errors.password?.message}
                  showStrength
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={watch('confirmPassword') || ''}
                  onChange={(value) => {
                    setValue('confirmPassword', value)
                    trigger('confirmPassword')
                  }}
                  error={errors.confirmPassword?.message}
                  placeholder="Confirm your password"
                />
              </div>

              {/* Privacy Consent */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="privacyConsent"
                    checked={watch('privacyConsent')}
                    onCheckedChange={(checked) => setValue('privacyConsent', checked === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="privacyConsent" className="text-xs text-muted-foreground leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                    . I understand that my data will be processed as described.
                  </label>
                </div>
                {errors.privacyConsent && (
                  <p className="text-xs text-destructive">{errors.privacyConsent.message}</p>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting || emailAvailable === false || usernameAvailable === false}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating your profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>
            </motion.form>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Elite Football Market - Where Talent Meets Opportunity
        </motion.p>
      </motion.div>
    </div>
  )
}
