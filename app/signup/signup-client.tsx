'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SoccerBallIcon } from '@/components/signup/football-icons'

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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue circle background */}
      <circle cx="12" cy="12" r="12" fill="#316FF6" />
      {/* White F */}
      <text x="12" y="16" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">
        f
      </text>
    </svg>
  )
}

export function SignupPageClient() {
  const [mounted, setMounted] = useState(false)
  const [proCount, setProCount] = useState(5247)
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMethodSelect = (method: 'email' | 'phone' | 'google' | 'facebook') => {
    setLoadingMethod(method)

    if (method === 'google' || method === 'facebook') {
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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden bg-background">
      {/* Background Image - Subtle */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/images/stadium-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-background/70" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md flex flex-col items-center justify-center gap-8"
      >
        {/* Logo/Icon Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
            <SoccerBallIcon className="w-10 h-10 text-background" />
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h1 className="text-5xl font-black text-foreground leading-tight text-balance">
            Millions of players.
          </h1>
          <h2 className="text-5xl font-black text-primary">
            One market.
          </h2>
          <p className="text-lg text-muted-foreground pt-3">
            Join {proCount.toLocaleString()}+ professionals. Get discovered.
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full space-y-4 pt-4"
        >
          {/* Primary: Sign up for free */}
          <Button
            onClick={() => handleMethodSelect('email')}
            disabled={loadingMethod !== null}
            className="w-full h-14 text-base font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/30"
          >
            Sign up free
          </Button>

          {/* Secondary Options */}
          <div className="space-y-2">
            {/* Phone */}
            <Button
              onClick={() => handleMethodSelect('phone')}
              disabled={loadingMethod !== null}
              className="w-full h-12 text-base font-semibold rounded-full border-2 border-foreground/30 bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-200"
            >
              <Phone className="h-5 w-5 mr-3" />
              Continue with phone number
            </Button>

            {/* Google */}
            <Button
              onClick={() => handleMethodSelect('google')}
              disabled={loadingMethod !== null}
              className="w-full h-12 text-base font-semibold rounded-full border-2 border-foreground/30 bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-200"
            >
              <GoogleIcon className="h-5 w-5 mr-3" />
              Continue with Google
            </Button>

            {/* Facebook */}
            <Button
              onClick={() => handleMethodSelect('facebook')}
              disabled={loadingMethod !== null}
              className="w-full h-12 text-base font-semibold rounded-full border-2 border-foreground/30 bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-200"
            >
              <FacebookIcon className="h-5 w-5 mr-3" />
              Continue with Facebook
            </Button>
          </div>
        </motion.div>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-base text-muted-foreground"
        >
          Already have an account?{' '}
          <a
            href="/login"
            className="text-primary hover:text-primary/90 font-bold transition-colors"
          >
            Log in
          </a>
        </motion.p>
      </motion.div>
    </div>
  )
}

