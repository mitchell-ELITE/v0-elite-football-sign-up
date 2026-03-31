'use client'

import { cn } from '@/lib/utils'

type Role = 'player' | 'scout'

interface RoleToggleProps {
  value: Role
  onChange: (role: Role) => void
  disabled?: boolean
}

export function RoleToggle({ value, onChange, disabled = false }: RoleToggleProps) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center rounded-full bg-secondary p-1">
        <button
          type="button"
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-full transition-all duration-200',
            value === 'player'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onChange('player')}
          disabled={disabled}
          aria-pressed={value === 'player'}
        >
          Player
        </button>
        <button
          type="button"
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-full transition-all duration-200',
            value === 'scout'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onChange('scout')}
          disabled={disabled}
          aria-pressed={value === 'scout'}
        >
          Scout
        </button>
      </div>
    </div>
  )
}
