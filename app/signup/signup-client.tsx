'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SignupForm } from '@/components/signup/signup-form'

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

export function SignupPageClient() {
  const [mounted, setMounted] = useState(false)
  const [proCount, setProCount] = useState(5000)

  useEffect(() => {
    setMounted(true)
    // Fetch pro count from API (mocked for Phase 1)
    // In production, this would fetch from /api/pro-count
    setProCount(5247)
  }, [])

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

            {/* Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <SignupForm
                onSuccess={(data) => {
                  console.log('Signup successful:', data)
                  // In production, redirect to email verification or dashboard
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Elite Football Market - Where Talent Meets Opportunity
        </motion.p>
      </motion.div>
    </div>
  )
}
