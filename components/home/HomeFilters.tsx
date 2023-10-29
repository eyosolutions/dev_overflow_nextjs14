"use client"

import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => { 
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get('filter');

  const [active, setActive] = useState(query || '');

  // console.log('ActiveState outside click: ', active);

  const handleFilterClick = (item: string) => {
    
    if (active === item) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null
      });

      router.push(newUrl, { scroll: false });

    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: item.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
   
  }
  useEffect(() => {
    return setActive(query!);
  }, [pathname, query])
  
  return (
    <div className="mt-10 hidden flex-wrap gap-3 self-start md:flex">
      {HomePageFilters.map((item) => (
        <Button
          onClick={() => handleFilterClick(item.value)}
          key={item.value}
          className={`body-medium h-9 rounded-lg px-6 py-3 capitalize shadow-none ${active === item.value
            ? 'bg-primary-100 text-primary-500 dark:bg-dark-400'
            : 'bg-light-800 text-light-500 dark:bg-dark-300'
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;