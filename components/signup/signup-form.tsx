'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, User, Calendar, AtSign, Check, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { PasswordInput } from './password-input'
import { PhoneInput } from './phone-input'
import { SocialAuthButtons } from './social-auth-buttons'
import { RoleToggle } from './role-toggle'
import { calculateAgeGroup } from '@/lib/validations/signup'

// Combined schema for form
const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    contactMethod: z.enum(['email', 'phone']),
    email: z.string().optional(),
    phone: z.string().optional(),
    countryCode: z.string().optional(),
    dialCode: z.string().optional(),
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
  .refine(
    (data) => {
      if (data.contactMethod === 'email') {
        return data.email && z.string().email().safeParse(data.email).success
      }
      return data.phone && data.phone.length >= 10
    },
    {
      message: 'Please provide a valid email or phone number',
      path: ['email'],
    }
  )

type SignupFormData = z.infer<typeof signupSchema>

interface SignupFormProps {
  onSuccess?: (data: SignupFormData) => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')
  const [role, setRole] = useState<'player' | 'scout'>('player')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Async validation states
  const [emailChecking, setEmailChecking] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      contactMethod: 'email',
      privacyConsent: false,
    },
    mode: 'onChange',
  })

  const password = watch('password')
  const dateOfBirth = watch('dateOfBirth')
  const email = watch('email')
  const username = watch('username')

  // Debounced email check
  const checkEmailAvailability = useCallback(
    async (emailValue: string) => {
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
    },
    []
  )

  // Debounced username check
  const checkUsernameAvailability = useCallback(
    async (usernameValue: string) => {
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
    },
    []
  )

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role,
          ageGroup: data.dateOfBirth ? calculateAgeGroup(data.dateOfBirth) : null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.')
      }

      setSubmitSuccess(true)
      onSuccess?.(data)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialAuth = (provider: 'google' | 'facebook' | 'apple') => {
    // Mocked for Phase 1
    alert(`Sign up with ${provider} coming soon! Please use email or phone for now.`)
  }

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Profile Created!</h2>
        <p className="text-muted-foreground mb-4">
          We have sent a confirmation email. Please verify your email to access your dashboard.
        </p>
        <p className="text-sm text-muted-foreground">
          {dateOfBirth && `Age Group: ${calculateAgeGroup(dateOfBirth)}`}
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Role Toggle */}
      <RoleToggle value={role} onChange={setRole} disabled={isSubmitting} />

      {/* Social Auth */}
      <div className="space-y-4">
        <SocialAuthButtons
          onGoogleClick={() => handleSocialAuth('google')}
          onFacebookClick={() => handleSocialAuth('facebook')}
          onAppleClick={() => handleSocialAuth('apple')}
          isLoading={isSubmitting}
        />
        <p className="text-xs text-center text-muted-foreground">
          Use the same email across sign-in methods to access your account
        </p>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Contact Method Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          type="button"
          variant={contactMethod === 'email' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'gap-2',
            contactMethod === 'email' && 'bg-primary text-primary-foreground'
          )}
          onClick={() => {
            setContactMethod('email')
            setValue('contactMethod', 'email')
          }}
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>
        <Button
          type="button"
          variant={contactMethod === 'phone' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'gap-2',
            contactMethod === 'phone' && 'bg-primary text-primary-foreground'
          )}
          onClick={() => {
            setContactMethod('phone')
            setValue('contactMethod', 'phone')
          }}
        >
          <Phone className="h-4 w-4" />
          Phone
        </Button>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
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
              'h-12 pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground',
              errors.fullName && 'border-destructive focus-visible:ring-destructive/50'
            )}
            aria-invalid={!!errors.fullName}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email or Phone */}
      <AnimatePresence mode="wait">
        {contactMethod === 'email' ? (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-2"
          >
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter your email"
                className={cn(
                  'h-12 pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground',
                  errors.email && 'border-destructive focus-visible:ring-destructive/50',
                  emailAvailable === false && 'border-destructive'
                )}
                onBlur={(e) => checkEmailAvailability(e.target.value)}
                aria-invalid={!!errors.email || emailAvailable === false}
              />
              {emailChecking && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
              )}
              {!emailChecking && emailAvailable === true && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
              )}
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
            {emailAvailable === false && (
              <p className="text-sm text-destructive">
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
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <PhoneInput
              value={watch('phone') || ''}
              countryCode={watch('countryCode') || 'US'}
              onPhoneChange={(phone) => setValue('phone', phone)}
              onCountryChange={(code, dialCode) => {
                setValue('countryCode', code)
                setValue('dialCode', dialCode)
              }}
              error={errors.phone?.message}
            />
            <p className="text-xs text-muted-foreground">
              We will send you a verification code via SMS
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Username */}
      <div className="space-y-2">
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
              'h-12 pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground',
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
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
          )}
        </div>
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
        {usernameAvailable === false && (
          <p className="text-sm text-destructive">
            This username is taken. Please choose another one.
          </p>
        )}
        {username && !errors.username && (
          <p className="text-xs text-muted-foreground">
            Your profile URL: footballmarket.com/{username}
          </p>
        )}
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
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
              'h-12 pl-10 bg-input border-border text-foreground [color-scheme:dark]',
              errors.dateOfBirth && 'border-destructive focus-visible:ring-destructive/50'
            )}
            aria-invalid={!!errors.dateOfBirth}
          />
        </div>
        {errors.dateOfBirth && (
          <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
        )}
        {dateOfBirth && !errors.dateOfBirth && (
          <p className="text-xs text-primary">
            Age Group: {calculateAgeGroup(dateOfBirth)}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
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
      <div className="space-y-2">
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
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacyConsent"
            checked={watch('privacyConsent')}
            onCheckedChange={(checked) => setValue('privacyConsent', checked === true)}
            className="mt-0.5"
          />
          <label htmlFor="privacyConsent" className="text-sm text-muted-foreground leading-relaxed">
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
          <p className="text-sm text-destructive">{errors.privacyConsent.message}</p>
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

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <a href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </a>
      </p>
    </form>
  )
}
