// app/page.tsx or layout.tsx
'use client';
import { SocketProvider } from '@/contexts/SocketProvider';
import InboxContent from './_components/InboxContent';

const Page = () => (
  <SocketProvider>
    <InboxContent />
  </SocketProvider>
);

export default Page;
