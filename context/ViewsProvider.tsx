"use client"
// viewsContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ViewsContextProps {
  initialView: number;
  setInitialView: React.Dispatch<React.SetStateAction<number>>;
  views: number;
  setViews: React.Dispatch<React.SetStateAction<number>>;
}

const ViewsContext = createContext<ViewsContextProps | undefined>(undefined);

export const ViewsProvider = ({ children }: { children: React.ReactNode}) => {
  const [initialView, setInitialView] = useState<number>(0);
  const [views, setViews] = useState<number>(0);

  return (
    <ViewsContext.Provider value={{ initialView, setInitialView, views, setViews }}>
      {children}
    </ViewsContext.Provider>
  );
};

export const useViews = () => {
  const context = useContext(ViewsContext);
  if (!context) {
    throw new Error('useViews must be used within a ViewsProvider');
  }
  return context;
};


// import React, { createContext, useContext, useState, useEffect } from "react";

// interface TotalviewsContextType {
//   views: number;
//   setViews: (views: number) => void;
// };

// const TotalviewsContext = createContext<TotalviewsContextType | undefined>(undefined);

// export function TotalviewsProvider({ children }: { children: React.ReactNode}) {
//   const [views, setViews] = useState(0);

//   const handleTotalviewsChange = () => {

//   };

//   useEffect(() => {
//     handleTotalviewsChange();
//   }, [views]);  

//   return (
//     <TotalviewsContext.Provider value={{ views, setViews }}>
//       {children}
//     </TotalviewsContext.Provider>
//   )
// };

// export function useTotalviews() {
//   const context = useContext(TotalviewsContext);

//   if (context === undefined) {
//     throw new Error('useTheme must be used within a TotalviewsProvider');
//   }
//   return context;
// };