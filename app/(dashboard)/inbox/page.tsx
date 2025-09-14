// app/page.tsx or layout.tsx
'use client';
import { InboxContent } from './_components/InboxContent';
import { SocketProvider } from './_components/useSocketProvider';

const Page = () => (
  <SocketProvider>
    <InboxContent />
  </SocketProvider>
);

export default Page;
