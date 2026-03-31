# IMPLEMENTATION KICKSTART - Elite Football Market Sign-Up (Phase 1)

**Version:** 1.0  
**Date:** March 31, 2026  
**Phase:** 1 - Quick Sign-Up Flow  
**Status:** Ready for Development

---

## Executive Summary

This document outlines the Phase 1 implementation for the Elite Football Market sign-up feature. Phase 1 focuses on a streamlined sign-up flow (3-5 minutes) that captures essential player information and sets up foundation for Phase 2 (Player Card Setup). The system is **frontend-only** with **mocked Firebase integration** for Phase 2 readiness.

**Phase 1 Output:**
- Email/Phone sign-up with verification mocks
- Google, Facebook, Apple OAuth (mocked, no real credentials yet)
- Real-time form validation with detailed error messaging
- Responsive design optimized for mobile
- Success confirmation screen

---

## Architecture Overview

### Tech Stack
| Component | Technology | Version | Notes |
|-----------|-----------|---------|-------|
| **Framework** | Next.js | 15 | App Router |
| **Language** | TypeScript | Latest | Type safety |
| **UI Library** | shadcn/ui | Latest | Pre-built components |
| **Styling** | Tailwind CSS | Latest | Utility-first |
| **Motion** | Framer Motion | 11.x | Smooth animations |
| **Forms** | React Hook Form | 7.x | Efficient form handling |
| **Validation** | Zod | Latest | Schema validation |
| **Phone Parsing** | libphonenumber-js | Latest | International support |
| **IP Geolocation** | (Mocked) | - | Auto-detect country |
| **Icons** | Lucide React | Latest | Consistent icons |
| **State** | React (Context) | 19 | Local state for auth flow |

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Sign-Up Page (/signup)                   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Background Image (responsive)              │   │
│  │         (fallback: no-logo when failed)              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Glassmorphism Card (dark charcoal + blur)       │   │
│  │                                                       │   │
│  │  ┌───────────────────────────────────────────────┐   │   │
│  │  │ Header: "Join Elite Market"                   │   │   │
│  │  │ Badge: ⚽ "5,000+ PROS" (from backend API)   │   │   │
│  │  └───────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  ┌───────────────────────────────────────────────┐   │   │
│  │  │ Role Toggle: Player / Scout (disabled)        │   │   │
│  │  └───────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  ┌───────────────────────────────────────────────┐   │   │
│  │  │ Email/Phone Tab Selector                      │   │   │
│  │  │                                                │   │   │
│  │  │ Tab 1: Email Sign-Up                          │   │   │
│  │  │  ├─ Full Name (text input)                    │   │   │
│  │  │  ├─ Email (email input)                       │   │   │
│  │  │  ├─ Username (text input)                     │   │   │
│  │  │  ├─ DOB (date input)                          │   │   │
│  │  │  ├─ Password (password input)                 │   │   │
│  │  │  ├─ Privacy Consent (checkbox)                │   │   │
│  │  │  └─ Sign Up Button (electric green, 48px)    │   │   │
│  │  │                                                │   │   │
│  │  │ Tab 2: Phone Sign-Up                          │   │   │
│  │  │  ├─ Full Name (text input)                    │   │   │
│  │  │  ├─ Phone Number (input + country selector)   │   │   │
│  │  │  ├─ Username (text input)                     │   │   │
│  │  │  ├─ DOB (date input)                          │   │   │
│  │  │  ├─ Password (password input)                 │   │   │
│  │  │  ├─ Privacy Consent (checkbox)                │   │   │
│  │  │  └─ Sign Up Button (electric green, 48px)    │   │   │
│  │  └───────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  ┌───────────────────────────────────────────────┐   │   │
│  │  │ Divider: "Or continue with"                   │   │   │
│  │  │                                                │   │   │
│  │  │ Social Buttons Row (3 buttons):               │   │   │
│  │  │  ├─ Google (icon-only, 48px)                 │   │   │
│  │  │  ├─ Facebook (icon-only, 48px)               │   │   │
│  │  │  └─ Apple (icon-only, 48px)                  │   │   │
│  │  │                                                │   │   │
│  │  │ Accessibility: aria-labels on buttons         │   │   │
│  │  └───────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  Real-Time Validation Errors (red text below field)  │   │
│  │  Success Toast: "Profile created successfully!"      │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

After Successful Sign-Up:
  → Mock Email Verification Modal (Phase 2)
  → Success Page: "Welcome to Elite Market"
  → Redirect to Player Card Setup (Phase 2)
```

---

## Phase 1 Data Model

### User Signup Data (Phase 1)
```typescript
interface SignupFormData {
  // Essential fields
  fullName: string;           // Required, 2-50 chars
  email?: string;             // Required if email tab
  phone?: string;             // Required if phone tab
  countryCode?: string;       // Auto-detected or selected
  username: string;           // Required, 3-20 alphanumeric + underscore
  dateOfBirth: string;        // Required, YYYY-MM-DD format
  password: string;           // Required, 8+ chars, 1 capital, 1 special
  privacyConsent: boolean;    // Required checkbox
  signupMethod: 'email' | 'phone' | 'google' | 'facebook' | 'apple';
}

interface SignupResponse {
  success: boolean;
  userId?: string;            // Firebase UID (Phase 2)
  message: string;
  verificationRequired?: boolean;
}
```

### Validation Rules

#### Full Name
- **Required:** Yes
- **Min Length:** 2 characters
- **Max Length:** 50 characters
- **Pattern:** Letters, spaces, hyphens, apostrophes only
- **Error:** "Full name must be 2-50 characters with only letters, spaces, hyphens, and apostrophes"

#### Email (Email Tab Only)
- **Required:** Yes (if email tab)
- **Format:** Valid email address (RFC 5322 simplified)
- **Uniqueness:** Check against existing accounts (mock backend)
- **Error:** "Please enter a valid email address" OR "This email is already registered"

#### Phone (Phone Tab Only)
- **Required:** Yes (if phone tab)
- **Format:** Valid international number with country code
- **Uniqueness:** Check against existing accounts (mock backend)
- **Validation Library:** `libphonenumber-js`
- **Error:** "Please enter a valid phone number for the selected country" OR "This phone number is already registered"

#### Country Code (Phone Tab)
- **Auto-Detection:** IP geolocation (mocked, default to 'US')
- **User Override:** Dropdown with all countries
- **Display:** Flag emoji + country name + code (e.g., 🇺🇸 United States +1)
- **Storage:** ISO 3166-1 alpha-2 code (e.g., 'US', 'GB', 'FR')

#### Username
- **Required:** Yes
- **Min Length:** 3 characters
- **Max Length:** 20 characters
- **Pattern:** Alphanumeric + underscore only, cannot start with number
- **Uniqueness:** Check against existing accounts (mock backend)
- **Case Sensitivity:** Stored lowercase, displayed as-is
- **Error:** "Username must be 3-20 characters (letters, numbers, underscore) and can't start with a number" OR "This username is already taken"

#### Date of Birth
- **Required:** Yes
- **Format:** YYYY-MM-DD (input type="date" handles UI)
- **Age Requirement:** Must be 13+ years old (age check required)
- **Min Year:** 1910 (no unrealistic ages)
- **Max Year:** Current year minus 13
- **Display Format:** Formatted as "January 15, 2005" in confirmation
- **Error:** "You must be at least 13 years old" OR "Please enter a valid date of birth"

#### Password
- **Required:** Yes
- **Min Length:** 8 characters
- **Max Length:** 128 characters
- **Requirements:** 
  - At least 1 uppercase letter (A-Z)
  - At least 1 special character (!@#$%^&*)
  - No requirement for numbers (but allowed)
- **Strength Meter:** Visual indicator (weak/medium/strong)
- **Error:** "Password must be at least 8 characters with 1 capital letter and 1 special character"

#### Privacy Consent
- **Required:** Yes (checkbox must be checked)
- **Text:** "I agree to the Privacy Policy and Terms of Service"
- **Links:** Both policy and terms (Phase 2 routes to actual pages)
- **Error:** "You must agree to the Privacy Policy and Terms of Service"

#### Duplicate Account Detection
- **Mechanism:** Mock API check on form submission (not in real-time to avoid UX strain)
- **Email Uniqueness:** `POST /api/auth/check-email`
- **Phone Uniqueness:** `POST /api/auth/check-phone`
- **Username Uniqueness:** `POST /api/auth/check-username`
- **Response:** `{ available: boolean }`
- **Error Message:** "This [email/phone/username] is already registered"

---

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                          # Root layout with fonts
│   ├── globals.css                         # Design tokens, Tailwind base
│   ├── page.tsx                            # Home (redirects to /signup or dashboard)
│   │
│   └── (auth)/
│       └── signup/
│           ├── page.tsx                    # Main signup page
│           ├── layout.tsx                  # Auth layout (no navbar)
│           │
│           └── components/
│               ├── SignupForm.tsx          # Main form component (email/phone tabs)
│               ├── EmailTab.tsx            # Email sign-up tab
│               ├── PhoneTab.tsx            # Phone sign-up tab
│               ├── CountrySelect.tsx       # Country code selector
│               ├── SocialAuthRow.tsx       # Google, Facebook, Apple buttons
│               ├── PasswordStrength.tsx    # Password strength indicator
│               ├── BackgroundImage.tsx     # Background with fallback
│               └── SuccessModal.tsx        # Success confirmation modal
│
├── components/
│   └── ui/                                 # shadcn/ui components (pre-existing)
│
├── lib/
│   ├── validation.ts                       # Zod schemas for all form fields
│   ├── auth.ts                             # Mock auth utilities (signup logic)
│   ├── phone.ts                            # Phone number utilities (libphonenumber-js)
│   ├── geolocation.ts                      # Mock IP geolocation (returns 'US')
│   ├── errorMessages.ts                    # Centralized error message strings
│   └── utils.ts                            # General utilities (cn function, etc.)
│
├── hooks/
│   ├── useSignup.ts                        # Custom hook for signup form state
│   ├── useCountries.ts                     # Custom hook for country list
│   └── use-mobile.tsx                      # Existing mobile detection hook
│
├── types/
│   └── auth.ts                             # TypeScript interfaces for auth
│
├── public/
│   └── images/
│       └── football-pitch.jpg              # Background image
│
├── DESIGN_TOKENS.md                        # Design system documentation
├── IMPLEMENTATION_KICKSTART.md             # This file
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## Component Specifications

### 1. **SignupForm.tsx** (Main Container)
**Props:**
- None (uses custom hook for state)

**State:**
- `currentTab: 'email' | 'phone'` - Active signup method
- `isLoading: boolean` - Submission state
- `successMessage: string | null` - Success state

**Features:**
- Tab switching between Email and Phone
- Real-time validation
- Form submission handling
- Error display
- Loading state on CTA button

**Exports:**
- `SignupForm` component

---

### 2. **EmailTab.tsx**
**Props:**
```typescript
{
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading: boolean;
}
```

**Fields:**
- Full Name (text input, 48px height)
- Email (email input, 48px height)
- Username (text input, 48px height)
- Date of Birth (date input, 48px height)
- Password (password input with show/hide toggle, 48px height)
- Password Strength Meter (inline, below password)
- Privacy Consent (checkbox + links)
- Sign Up Button (electric green, 48px height, full width)

**Validation Triggers:**
- Real-time on blur for each field
- Submission validation (all fields)

**Features:**
- Auto-detect duplicate email on blur
- Real-time password strength calculation

---

### 3. **PhoneTab.tsx**
**Props:**
```typescript
{
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading: boolean;
}
```

**Fields:**
- Full Name (text input, 48px height)
- Phone Number (input with integrated country code selector, 48px height)
  - Country flag emoji
  - Country name in dropdown
  - Phone number input (right side)
- Username (text input, 48px height)
- Date of Birth (date input, 48px height)
- Password (password input with show/hide toggle, 48px height)
- Password Strength Meter (inline, below password)
- Privacy Consent (checkbox + links)
- Sign Up Button (electric green, 48px height, full width)

**Validation Triggers:**
- Real-time on blur
- Phone validation uses `libphonenumber-js`

**Features:**
- Auto-detect country code from IP (mocked → 'US')
- Dropdown to change country
- Format phone number as user types (e.g., "+1 (555) 123-4567")

---

### 4. **CountrySelect.tsx**
**Props:**
```typescript
{
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
  disabled?: boolean;
}
```

**Features:**
- Searchable dropdown with all countries
- Flag emoji + country name + code display
- Scroll to selected country on open
- Keyboard navigation support
- Auto-detect on component mount (mocked to 'US')

---

### 5. **SocialAuthRow.tsx**
**Props:**
- None (uses mock onClick handlers)

**Features:**
- Three buttons: Google, Facebook, Apple (icon-only)
- 48px × 48px buttons (touch-friendly)
- Gap of 12px between buttons
- `aria-label` on each button: "Sign up with Google", etc.
- Hover state: subtle scale increase
- On click: Toast notification "OAuth mocked - Phase 2 implementation" (dev-only)

---

### 6. **PasswordStrength.tsx**
**Props:**
```typescript
{
  password: string;
}
```

**Features:**
- Visual bar (0-100%)
- Color gradient: Red (weak) → Yellow (medium) → Green (strong)
- Text indicator: "Weak", "Medium", "Strong"
- Checks:
  - Length ≥ 8
  - Has uppercase
  - Has special character
  - Bonus: 10+ chars or 3+ character types

---

### 7. **BackgroundImage.tsx**
**Features:**
- Fetches image from `/public/images/football-pitch.jpg`
- CSS: `background-size: cover; background-position: center;`
- Responsive: scales to fill container on all screen sizes
- Fallback: If image fails to load, render no image (transparent/empty div)
- Fixed positioning behind main card
- Overlay: Optional subtle dark overlay for text readability

---

### 8. **SuccessModal.tsx**
**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}
```

**Features:**
- Modal overlay (dark overlay, centered card)
- Icon: ✓ check mark (electric green)
- Headline: "Profile Created Successfully!"
- Subtext: "Welcome to Elite Market. A confirmation email has been sent to [email]"
- CTA: "Continue to Email Verification" button
- Animation: Slide up from bottom, fade in

---

## API Endpoints (Mocked)

### Phase 1 Mocked Endpoints

#### `POST /api/auth/signup`
**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "countryCode": "US",
  "username": "johndoe7",
  "dateOfBirth": "2005-01-15",
  "password": "SecurePass123!",
  "privacyConsent": true,
  "signupMethod": "email"
}
```

**Response (Success):**
```json
{
  "success": true,
  "userId": "mock-user-id-12345",
  "message": "Sign up successful. Please verify your email.",
  "verificationRequired": true
}
```

**Response (Error - Duplicate Account):**
```json
{
  "success": false,
  "message": "This email is already registered. Try logging in instead."
}
```

#### `POST /api/auth/check-email`
**Request:** `{ email: string }`  
**Response:** `{ available: boolean }`

#### `POST /api/auth/check-phone`
**Request:** `{ phone: string, countryCode: string }`  
**Response:** `{ available: boolean }`

#### `POST /api/auth/check-username`
**Request:** `{ username: string }`  
**Response:** `{ available: boolean }`

#### `GET /api/settings/player-count`
**Purpose:** Fetch the "5,000+ PROS" badge number (updated every 7 days)  
**Response:**
```json
{
  "count": 5000,
  "lastUpdated": "2026-03-24T00:00:00Z"
}
```

---

## Form Submission Flow

```
User Action: Click "Sign Up"
    ↓
Validation: Check all fields locally (Zod schema)
    ↓
[Valid?] ← No → Display inline error messages (red text)
    ↓ Yes
Show Loading State (button → spinner)
    ↓
API Call: POST /api/auth/signup
    ↓
[Success?]
    ├─ Yes → Show Success Modal
    │        ↓
    │        Wait 2 seconds
    │        ↓
    │        Redirect to Success Page (Phase 2)
    │
    └─ No → Show Error Toast (top-right, red background)
            ↓
            Retry Logic: User can re-submit or edit fields
```

---

## Error Handling Strategy

### Validation Errors (Real-Time)
- **Trigger:** On blur or form submission
- **Display:** Red text below field, immediately visible
- **Style:** Font size 12px, font-medium, color error-red
- **Message Format:** Simple, actionable English
  - ❌ "Invalid email format"
  - ❌ "Password must be at least 8 characters"
  - ✅ "Enter a valid email address"
  - ✅ "Password must have 8+ characters, 1 capital letter, and 1 special character"

### Duplicate Account Detection
- **Check on:** Form submission (phone/email/username)
- **Display:** Toast notification (top-right, 4 seconds)
- **Message:** "This [field] is already registered. [Link to Login]"
- **Retry:** User can modify field and resubmit

### Network/Server Errors
- **Display:** Toast notification (red background, top-right)
- **Message:** "Something went wrong. Please try again."
- **Action:** Show "Retry" button in toast
- **Fallback:** Keep form data in state so user doesn't lose input

### OAuth Errors (Phase 1 - Mocked)
- **Display:** Toast notification
- **Message:** "OAuth is not yet implemented. Use email or phone sign-up."

---

## User Experience Flow (3-5 minute timeline)

### Scenario 1: Email Sign-Up (Typical Path)
```
T+0:00    User lands on /signup
T+0:15    Selects Email tab (already selected by default)
T+0:30    Enters Full Name, Email, Username, DOB
T+1:00    Enters Password, sees strength meter update
T+1:15    Clicks Privacy Consent checkbox
T+1:30    Clicks "Sign Up" button
T+1:45    Form validates in real-time, phone shows spinner
T+2:00    API responds with success
T+2:15    Success modal appears with "Profile Created Successfully!"
T+2:30    Modal auto-closes (or user clicks "Continue")
T+2:45    Redirect to email verification page (Phase 2)
T+3:00    End of flow
```

### Scenario 2: Phone Sign-Up with Country Selector
```
T+0:00    User lands on /signup, selects Phone tab
T+0:30    Enters Full Name
T+0:45    Opens Country Selector (defaults to 'US')
T+1:00    Searches for "GB" (Great Britain)
T+1:15    Selects "🇬🇧 United Kingdom +44"
T+1:30    Enters phone number, auto-formats to "+44 XXXX XXXXXX"
T+2:00    Continues with Username, DOB, Password
T+2:30    Clicks "Sign Up"
T+3:00    Success modal appears
T+3:30    Redirect to phone verification page (Phase 2)
T+4:00    End of flow
```

---

## Mobile Responsiveness

### Breakpoints
| Screen Size | Layout | Adjustments |
|-------------|--------|-------------|
| 320px - 480px | Single Column | Full width card, 24px padding, 48px buttons |
| 480px - 768px | Single Column | Full width card, 32px padding, 48px buttons |
| 768px+ | Centered Card | Max-width 500px, 32px padding, 48px buttons |

### Mobile-Specific Features
- **Spacious Touch Targets:** 48px height for all inputs and buttons (iOS/Android HIG)
- **Background Image:** Crops to center, maintains aspect ratio
- **Glassmorphism:** Slightly reduced blur on mobile (8px vs 10px)
- **Font Sizes:** No change - readable at all screen sizes
- **Error Messages:** Inline below fields, no horizontal overflow
- **Social Buttons:** Vertical stack on screens < 400px, horizontal row on larger

---

## Accessibility Checklist

- [ ] All buttons have `aria-labels` or visible text
  - Icon-only social buttons: `aria-label="Sign up with Google"`
- [ ] Form labels associated with inputs via `htmlFor`
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Focus ring visible on all interactive elements (2px electric green)
- [ ] Tab order logical: Full Name → Email → ... → Sign Up button
- [ ] Color not the only indicator (red errors have text descriptions)
- [ ] Touch targets ≥ 48px × 48px
- [ ] Contrast ratios meet WCAG AA (all colors verified in DESIGN_TOKENS.md)
- [ ] Form can be submitted via Enter key
- [ ] Password input has toggle button for visibility (with aria-label)
- [ ] Animations respect `prefers-reduced-motion`

---

## Testing Checklist

### Unit Tests (Zod Validation)
- [ ] Valid email acceptance/rejection
- [ ] Valid phone number acceptance/rejection
- [ ] Username format validation
- [ ] Password strength requirements
- [ ] Date of birth age check
- [ ] Privacy consent requirement

### Integration Tests (Form Submission)
- [ ] Email tab submission with valid data
- [ ] Phone tab submission with valid data
- [ ] Duplicate account detection error
- [ ] Network error handling and retry
- [ ] Success modal display and redirect

### E2E Tests
- [ ] Complete email sign-up flow (start to success)
- [ ] Complete phone sign-up flow (start to success)
- [ ] Tab switching between email and phone
- [ ] Country selector search and selection
- [ ] Password visibility toggle
- [ ] Social button clicks (mocked responses)

### Manual QA
- [ ] Mobile responsiveness (iPhone SE, iPhone 14, Android)
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter)
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Real-time validation on blur
- [ ] Error message clarity
- [ ] Loading state visual feedback

---

## Phase 1 Success Criteria

✅ **Core Flow Works**
- Users can sign up with email or phone
- Form validates in real-time
- Success modal displays after submission

✅ **Data Validation**
- All fields follow spec (password, DOB, phone, etc.)
- Duplicate detection prevents duplicate accounts
- Error messages are clear and actionable

✅ **UX Quality**
- Mobile-responsive (tested on 320px - 1080px)
- Accessible (WCAG AA, keyboard navigation)
- Smooth animations (framer-motion, no jank)
- 3-5 minute sign-up time for typical user

✅ **Styling**
- Electric green accents on dark charcoal background
- Glassmorphism card with backdrop blur
- Responsive background image with fallback
- Consistent spacing (Tailwind scale: 4px, 8px, 16px, etc.)

---

## Phase 2 Preparation (Not Implemented Yet)

These features are mocked or stubbed out for Phase 1:
- Firebase Authentication integration
- Email verification via SMS (mocked modal)
- Player Card setup page
- OAuth provider credentials
- Email confirmation flow
- Analytics/tracking

---

## Development Checklist

### Setup Phase
- [ ] Create `/app/(auth)/signup/` folder structure
- [ ] Generate component skeleton files
- [ ] Set up `useSignup` custom hook
- [ ] Create Zod validation schemas in `lib/validation.ts`

### Component Development
- [ ] Build EmailTab with real-time validation
- [ ] Build PhoneTab with country selector
- [ ] Build SocialAuthRow with icon buttons
- [ ] Build PasswordStrength meter
- [ ] Build BackgroundImage with fallback

### Utilities & State
- [ ] Create mock API handlers in `/api/auth/`
- [ ] Create phone parsing utilities
- [ ] Create mock geolocation (returns 'US')
- [ ] Create centralized error messages

### Styling & Polish
- [ ] Apply Design Tokens to all components
- [ ] Verify color contrast (WCAG AA/AAA)
- [ ] Add framer-motion animations
- [ ] Test responsive design on mobile

### Testing & QA
- [ ] Write Zod schema tests
- [ ] Write component integration tests
- [ ] Manual QA on mobile/desktop
- [ ] Accessibility audit (WAVE, Axe)

### Documentation
- [ ] Update README with signup flow
- [ ] Document API endpoints
- [ ] Create contributing guide for Phase 2

---

## Success Metrics (Post-Launch)

- Sign-up completion rate (target: >70%)
- Average time to sign-up (target: 3-5 minutes)
- Mobile traffic percentage (target: >60%)
- Error rate on form submission (target: <5%)
- User satisfaction (target: >4/5 stars)

---

## Timeline Estimate

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Setup & Planning** | 2 hours | Folder structure, initial components |
| **Component Development** | 6 hours | All components built and integrated |
| **Validation & Utilities** | 2 hours | Zod schemas, phone parsing, APIs |
| **Styling & Animations** | 2 hours | Design tokens applied, framer-motion |
| **Testing & QA** | 3 hours | Unit, integration, E2E tests |
| **Documentation** | 1 hour | README, API docs, contributing guide |
| **Total** | ~16 hours | Production-ready Phase 1 |

---

## Notes & Open Items

- **Background Image:** Placeholder path `/public/images/football-pitch.jpg` - needs actual source
- **Country List:** Full list of 195+ countries required for CountrySelect dropdown
- **OAuth Phase 2:** Will require Google, Facebook, Apple credentials setup
- **Firebase Phase 2:** Database schema and authentication rules to be defined
- **Analytics Phase 2:** Event tracking and funnel analysis to be implemented
- **Email Verification Phase 2:** SMS/Email service integration (Twilio, SendGrid, etc.)

---

**Next Step:** Await user approval (LGTM) to proceed with implementation.
