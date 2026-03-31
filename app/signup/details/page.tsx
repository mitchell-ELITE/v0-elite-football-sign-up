import { Suspense } from 'react'
import { SignupDetailsClient } from './details-client'

export const metadata = {
  title: 'Complete Your Profile | Elite Football Market',
  description: 'Fill in your details to create your player profile on Elite Football Market.',
}

export default function SignupDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignupDetailsClient />
    </Suspense>
  )
}
