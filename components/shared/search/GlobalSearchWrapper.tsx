"use client"
import { Suspense } from 'react';
import GlobalSearch from './GlobalSearch';

const GlobalSearchFallback = () => (
  <div className="relative w-full max-w-[37.5rem] max-lg:hidden">
    <div className="background-light800_darkgradient relative flex min-h-[3.5rem] grow items-center gap-1 rounded-xl px-4">
      <div className="h-6 w-6 animate-pulse bg-gray-300 rounded" />
      <div className="flex-1 h-6 bg-gray-300 animate-pulse rounded" />
    </div>
  </div>
);

const GlobalSearchWrapper = () => {
  return (
    <Suspense fallback={<GlobalSearchFallback />}>
      <GlobalSearch />
    </Suspense>
  );
};

export default GlobalSearchWrapper;
