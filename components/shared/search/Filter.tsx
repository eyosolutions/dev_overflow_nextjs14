"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formUrlQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FilterProps {
  filters: {
    name: string, 
    value: string
  }[];
  otherClasses?: string;
  containerClasses?: string;
};

const Filter = ({ filters, otherClasses, containerClasses }: FilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('filter');

  const [active, setActive] = useState(query || '');

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
    //  className="background-light800_dark300 flex h-[3.5rem] grow max-sm:items-stretch md:hidden"
    <div className={`relative ${containerClasses}`}>
      <Select
        value={`${active !== null ? active : ""}`}
        onValueChange={handleFilterClick}
      >
        {/* className="w-[180px]" */}
        <SelectTrigger className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>         
        </SelectTrigger>
        <SelectContent className="background-light800_darkgradient text-dark100_light900">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}     
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;