"use client"

import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";

const GlobalResult = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);

  const searchParams = useSearchParams();
  const global = searchParams.get('global');
  const type = searchParams.get('type');

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);
      try {
        // Make a call to database and get everything
        const res = await globalSearch({ query: global, type });
        
        setResult(JSON.parse(res));

      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
    if (global) {
      fetchResult();
    }
  }, [global, type])
  
  const renderLink = (type: string, id: string) => {

    switch (type) {
      case 'question':
        return `/question/${id}`
      case 'answer':
        return `/question/${id}`
      case 'user':
        return `/profile/${id}`
      case 'tag':
        return `/tags/${id}`
      default:
        return '/';
    }
  }

  return (
    <div className="background-light800_dark400 absolute top-full mt-3 flex w-full flex-col justify-center rounded-xl py-5 shadow-sm">
      <GlobalFilters />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50"></div>
      <div className="space-y-5">
        <p className="paragraph-semibold text-dark400_light900 px-5">Top Match</p>
        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">Browsing the entire database</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item:any, index:number) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={item.type + item.id + index}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="Tag-icon"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">{item.title}</p>
                    <p className="small-medium text-light400_light500 mt-1 font-bold capitalize">{item.type}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">Oops, no results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
