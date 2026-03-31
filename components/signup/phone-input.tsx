'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { countries, detectCountryFromIP, type Country } from '@/lib/data/countries'

interface PhoneInputProps {
  value: string
  countryCode: string
  onPhoneChange: (phone: string) => void
  onCountryChange: (countryCode: string, dialCode: string) => void
  onBlur?: () => void
  error?: string
  id?: string
  name?: string
}

export function PhoneInput({
  value,
  countryCode,
  onPhoneChange,
  onCountryChange,
  onBlur,
  error,
  id = 'phone',
  name = 'phone',
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedCountry = countries.find((c) => c.code === countryCode) || detectCountryFromIP()

  // Auto-detect country on mount
  useEffect(() => {
    if (!countryCode) {
      const detected = detectCountryFromIP()
      onCountryChange(detected.code, detected.dialCode)
    }
  }, [countryCode, onCountryChange])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dialCode.includes(search) ||
      country.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (country: Country) => {
    onCountryChange(country.code, country.dialCode)
    setIsOpen(false)
    setSearch('')
  }

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '')
    return digits
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <div className="relative">
          <Button
            ref={buttonRef}
            type="button"
            variant="outline"
            className={cn(
              'h-12 px-3 gap-1 min-w-[100px] justify-between bg-input border-border text-foreground hover:bg-secondary',
              isOpen && 'ring-2 ring-ring'
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label="Select country code"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm">{selectedCountry.dialCode}</span>
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </Button>

          {/* Dropdown */}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 mt-1 w-72 max-h-64 overflow-hidden rounded-lg border border-border bg-popover shadow-lg z-50"
              role="listbox"
            >
              {/* Search */}
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search countries..."
                    className="pl-9 h-9 bg-input border-border"
                    autoFocus
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No countries found
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-secondary transition-colors',
                        country.code === selectedCountry.code && 'bg-secondary'
                      )}
                      onClick={() => handleSelect(country)}
                      role="option"
                      aria-selected={country.code === selectedCountry.code}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="flex-1 text-sm text-foreground">
                        {country.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {country.dialCode}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <Input
          id={id}
          name={name}
          type="tel"
          value={value}
          onChange={(e) => onPhoneChange(formatPhoneNumber(e.target.value))}
          onBlur={onBlur}
          placeholder="Phone number"
          className={cn(
            'flex-1 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground',
            error && 'border-destructive focus-visible:ring-destructive/50'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
