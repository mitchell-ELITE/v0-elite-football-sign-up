'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

// Google Icon
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// Facebook Icon
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

// Apple Icon
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

export function SignupPageClient() {
  const [mounted, setMounted] = useState(false)
  const [proCount, setProCount] = useState(5000)
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Fetch pro count from API
    setProCount(5247)
  }, [])

  const handleMethodSelect = (method: 'email' | 'phone' | 'google' | 'facebook' | 'apple') => {
    setLoadingMethod(method)
    
    if (method === 'google' || method === 'facebook' || method === 'apple') {
      // Mocked for Phase 1 - show message then redirect to email form
      setTimeout(() => {
        alert(`Sign up with ${method.charAt(0).toUpperCase() + method.slice(1)} coming soon! Redirecting to email sign up.`)
        router.push('/signup/details?method=email')
      }, 500)
    } else {
      // Navigate to details page with selected method
      router.push(`/signup/details?method=${method}`)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background Image with Fallback */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/stadium-bg.jpg)',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-background/90" />
      </div>

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Glassmorphism Card */}
        <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/20 to-transparent opacity-50 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <FootballIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  JOIN {proCount.toLocaleString()}+ PROS ON THE MARKET
                </span>
              </div>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance"
              >
                Create Your Player Profile
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-balance"
              >
                Get discovered by scouts worldwide. Start your journey now.
              </motion.p>
            </div>

            {/* Sign Up Options */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              {/* Sign up for free (Email) */}
              <Button
                type="button"
                variant="default"
                className={cn(
                  'w-full h-12 text-base font-semibold gap-3',
                  'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
                onClick={() => handleMethodSelect('email')}
                disabled={loadingMethod !== null}
              >
                <Mail className="h-5 w-5" />
                Sign up for free
              </Button>

              {/* Continue with Phone */}
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'w-full h-12 text-base font-medium gap-3',
                  'border-border bg-secondary hover:bg-secondary/80 text-foreground'
                )}
                onClick={() => handleMethodSelect('phone')}
                disabled={loadingMethod !== null}
              >
                <Phone className="h-5 w-5" />
                Continue with phone number
              </Button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Social Auth Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* Google */}
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'h-12 border-border bg-secondary hover:bg-secondary/80 transition-all',
                    'hover:scale-[1.02] hover:border-primary/50'
                  )}
                  onClick={() => handleMethodSelect('google')}
                  disabled={loadingMethod !== null}
                  aria-label="Continue with Google"
                >
                  <GoogleIcon className="h-5 w-5" />
                </Button>

                {/* Apple */}
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'h-12 border-border bg-secondary hover:bg-secondary/80 transition-all',
                    'hover:scale-[1.02] hover:border-primary/50 text-foreground'
                  )}
                  onClick={() => handleMethodSelect('apple')}
                  disabled={loadingMethod !== null}
                  aria-label="Continue with Apple"
                >
                  <AppleIcon className="h-5 w-5" />
                </Button>

                {/* Facebook */}
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'h-12 border-border bg-secondary hover:bg-secondary/80 transition-all',
                    'hover:scale-[1.02] hover:border-primary/50 text-[#1877F2]'
                  )}
                  onClick={() => handleMethodSelect('facebook')}
                  disabled={loadingMethod !== null}
                  aria-label="Continue with Facebook"
                >
                  <FacebookIcon className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-6 border-t border-border"
            >
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <a href="/login" className="text-primary hover:underline font-medium">
                  Log in
                </a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Elite Football Market - Where Talent Meets Opportunity
        </motion.p>
      </motion.div>
    </div>
  )
}
