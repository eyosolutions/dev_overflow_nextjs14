"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface LocationFilterProps {
  countriesFilter: {
    name: string;
    flag: string;
  }[];
};

const LocationFilter = ({ countriesFilter }: LocationFilterProps) => {

  const router = useRouter();
  // const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('location');

  const [active, setActive] = useState(query || '');

  const handleLocationFilterClick = (item: string) => {
    // alert(item);
    if (active === item) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'location',
        value: null
      });

      router.push(newUrl, { scroll: false });

    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'location',
        value: item
      });

      router.push(newUrl, { scroll: false });
    }
  }

  return (
    <div>
      <Select
        onValueChange={handleLocationFilterClick}
        value={active || ""}
      >
        {/* className="w-[180px]" */}
        <SelectTrigger className="body-regular background-light800_dark300 text-dark500_light700 light-border shadow-light100_darknone flex min-h-[56px] justify-start gap-3 border border-slate-200 px-4 py-2.5 dark:border-slate-800 sm:w-[210px]">
          <Image
            src='/assets/icons/location.svg'
            alt='location-icon'
            width={20}
            height={20}
          />
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue aria-label={active || ""} placeholder="Select Location" />
          </div>         
        </SelectTrigger>
        <SelectContent className="small-regular text-dark500_light700 max-h-[320px] max-w-[240px] border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup className="">
            {countriesFilter.map((item: any) => (
              <SelectItem
                key={item.name}
                value={item.name}
                className="cursor-pointer py-3 focus:bg-light-800 dark:focus:bg-dark-400"
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

export default LocationFilter;
