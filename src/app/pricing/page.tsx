import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Pricing — UGCFire.ai',
};

export default function PricingPage() {
  redirect('/#pricing');
}
