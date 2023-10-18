import LeftSidebar from '@/components/shared/LeftSidebar';
import Navbar from '@/components/shared/Navbar';
import RightSidebar from '@/components/shared/RightSidebar';
import { auth } from '@clerk/nextjs';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  // My own code to pass userId to leftsidebar component
  const user = auth();
  // End of my own code
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSidebar userId={user.userId!} />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">
            {children}
          </div>
        </section>
        <RightSidebar />
      </div>
      {/* Toaster */}
    </main>
  );
};

export default Layout;
