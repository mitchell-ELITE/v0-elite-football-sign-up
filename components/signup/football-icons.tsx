'use client'

// Premium Football Market Icons

export function SoccerBallIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Pentagon panels */}
      <path
        d="M12 2.5L15.5 6L14 10.5H10L8.5 6L12 2.5Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M16.5 7.5L19 10L17.5 14.5L13.5 13.5L14 10.5L16.5 7.5Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M17.5 14.5L19 18L15 20L10 19L13.5 13.5L17.5 14.5Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M10 19L5 18L3 14.5L6.5 13.5L10 19Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M8.5 6L5 10L6.5 13.5L10 10.5L8.5 6Z"
        fill="currentColor"
        opacity="0.3"
      />
      {/* Pitch lines */}
      <path d="M12 2.5V21.5" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  )
}

export function PitchGridIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pitch outline */}
      <rect x="2" y="3" width="20" height="18" stroke="currentColor" strokeWidth="1.5" />
      {/* Center line */}
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Center circle */}
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Center spot */}
      <circle cx="12" cy="12" r="0.5" fill="currentColor" opacity="0.8" />
      {/* Goal areas */}
      <rect x="2" y="8" width="4" height="8" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <rect x="18" y="8" width="4" height="8" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      {/* Penalty arcs */}
      <path
        d="M6 6 Q 6 3 8 3"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M18 6 Q 18 3 16 3"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}

export function StadiumLightsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Light mast */}
      <line x1="12" y1="2" x2="12" y2="10" stroke="currentColor" strokeWidth="2" />
      {/* Light fixtures */}
      <circle cx="6" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="18" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.7" />
      {/* Light beams */}
      <path
        d="M6 10 L4 18"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M12 6 L12 20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M18 10 L20 18"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  )
}

export function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cup */}
      <path
        d="M7 4H17V10C17 13 15 15 12 15C9 15 7 13 7 10V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        opacity="0.3"
      />
      {/* Handles */}
      <path
        d="M7 7C5 7 4 8 4 10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M17 7C19 7 20 8 20 10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Base */}
      <rect x="9" y="15" width="6" height="2" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.7" />
      <rect x="8" y="17" width="8" height="1.5" stroke="currentColor" strokeWidth="0.8" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export function EliteShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield */}
      <path
        d="M12 2L3 6V12C3 17.5 12 22 12 22C12 22 21 17.5 21 12V6L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        opacity="0.2"
      />
      {/* Checkmark */}
      <path
        d="M10 13L11.5 14.5L14 11"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
