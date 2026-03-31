'use client'

import { useState } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getPasswordStrength } from '@/lib/validations/signup'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  showStrength?: boolean
  placeholder?: string
  id?: string
  name?: string
}

export function PasswordInput({
  value,
  onChange,
  onBlur,
  error,
  showStrength = false,
  placeholder = 'Create a password',
  id = 'password',
  name = 'password',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const strength = getPasswordStrength(value)

  const requirements = [
    { label: 'At least 8 characters', met: value.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(value) },
  ]

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            'h-12 pr-12 bg-input border-border text-foreground placeholder:text-muted-foreground',
            error && 'border-destructive focus-visible:ring-destructive/50'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}

      {showStrength && value.length > 0 && (
        <div className="space-y-3">
          {/* Strength Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  strength.color
                )}
                style={{ width: `${(strength.score / 6) * 100}%` }}
              />
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                strength.score <= 2 && 'text-destructive',
                strength.score > 2 && strength.score <= 4 && 'text-warning',
                strength.score > 4 && 'text-success'
              )}
            >
              {strength.label}
            </span>
          </div>

          {/* Requirements Checklist */}
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li
                key={req.label}
                className={cn(
                  'flex items-center gap-2 text-xs transition-colors',
                  req.met ? 'text-success' : 'text-muted-foreground'
                )}
              >
                {req.met ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
                {req.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
