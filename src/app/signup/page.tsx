import { Suspense } from 'react';
import AuthPage from '@/components/auth/AuthPage';
import SiteFooter from '@/components/shared/SiteFooter';

export const metadata = {
  title: 'Sign Up — UGCFire.ai',
  description: 'Create your UGCFire.ai account.',
};

export default function SignupPage() {
  return (
    <>
      <Suspense>
        <AuthPage defaultTab="signup" />
      </Suspense>
      <SiteFooter />
    </>
  );
}
