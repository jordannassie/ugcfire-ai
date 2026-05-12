import { Suspense } from 'react';
import AuthPage from '@/components/auth/AuthPage';
import SiteFooter from '@/components/shared/SiteFooter';

export const metadata = {
  title: 'Log In — UGCFire.ai',
  description: 'Log in to your UGCFire.ai account.',
};

export default function LoginPage() {
  return (
    <>
      <Suspense>
        <AuthPage defaultTab="login" />
      </Suspense>
      <SiteFooter />
    </>
  );
}
