'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  SoccerBallIcon,
  PitchGridIcon,
  StadiumLightsIcon,
  EliteShieldIcon,
} from '@/components/signup/football-icons'

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function SignupPageClient() {
  const [mounted, setMounted] = useState(false)
  const [proCount, setProCount] = useState(5247)
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMethodSelect = (method: 'email' | 'phone' | 'google' | 'facebook' | 'apple') => {
    setLoadingMethod(method)

    if (method === 'google' || method === 'facebook' || method === 'apple') {
      setTimeout(() => {
        alert(`${method.charAt(0).toUpperCase() + method.slice(1)} sign up coming soon!`)
        router.push('/signup/details?method=email')
      }, 500)
    } else {
      router.push(`/signup/details?method=${method}`)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/stadium-bg.jpg)',
        }}
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

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 right-10 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <StadiumLightsIcon className="w-32 h-32 text-primary" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-10 opacity-10"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        <PitchGridIcon className="w-40 h-40 text-primary" />
      </motion.div>

      {/* Main Content Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full max-w-md"
      >
        {/* Premium Glassmorphism Card */}
        <div className="glass-premium p-8 sm:p-10">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-40 pointer-events-none" />

          <div className="relative space-y-6">
            {/* Elite Badge */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center"
            >
              <div className="badge-elite">
                <EliteShieldIcon className="w-4 h-4" />
                <span>TRUSTED BY {proCount.toLocaleString()}+ PROS</span>
              </div>
            </motion.div>

            {/* Hero Text */}
            <motion.div
              variants={itemVariants}
              className="text-center space-y-2"
            >
              <h1 className="text-3xl sm:text-4xl font-black text-foreground text-balance leading-tight">
                Get Discovered.
                <br />
                <span className="text-gradient-elite">Change Your Game.</span>
              </h1>
              <p className="text-base text-muted-foreground text-balance">
                Join the elite marketplace. Connect with scouts and clubs worldwide.
              </p>
            </motion.div>

            {/* Sign Up Options */}
            <motion.div
              variants={itemVariants}
              className="space-y-3 pt-2"
            >
              {/* Primary: Sign up for free */}
              <Button
                type="button"
                className={cn(
                  'w-full h-13 text-base font-bold gap-2.5 rounded-xl',
                  'btn-premium-primary'
                )}
                onClick={() => handleMethodSelect('email')}
                disabled={loadingMethod !== null}
              >
                <Mail className="h-5 w-5" />
                Sign up for free
              </Button>

              {/* Secondary: Phone */}
              <Button
                type="button"
                className={cn(
                  'w-full h-12 text-base font-semibold gap-2.5 rounded-xl',
                  'btn-premium-secondary'
                )}
                onClick={() => handleMethodSelect('phone')}
                disabled={loadingMethod !== null}
              >
                <Phone className="h-5 w-5" />
                Continue with phone number
              </Button>

              {/* Divider */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-card/90 px-3 text-muted-foreground font-medium">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social Auth Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Google */}
                <Button
                  type="button"
                  size="icon"
                  className={cn(
                    'h-12 rounded-xl',
                    'btn-premium-secondary btn-social-hover'
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
                  size="icon"
                  className={cn(
                    'h-12 rounded-xl',
                    'btn-premium-secondary btn-social-hover'
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
                  size="icon"
                  className={cn(
                    'h-12 rounded-xl',
                    'btn-premium-secondary btn-social-hover'
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
              variants={itemVariants}
              className="pt-4 border-t border-border/40"
            >
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-primary hover:text-primary/90 font-bold transition-colors"
                >
                  Log in
                </a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-muted-foreground mt-8 font-medium tracking-wide uppercase"
        >
          Elite Football Market
        </motion.p>
      </motion.div>
    </div>
  )
}
