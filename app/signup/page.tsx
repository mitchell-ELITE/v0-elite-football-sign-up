import { Metadata } from 'next'
import { SignupPageClient } from './signup-client'

export const metadata: Metadata = {
  title: 'Sign Up | Elite Football Market',
  description:
    'Join 5,000+ professional footballers on the Elite Football Market. Create your player profile and connect with scouts worldwide.',
}

export default function SignupPage() {
  return <SignupPageClient />
}
