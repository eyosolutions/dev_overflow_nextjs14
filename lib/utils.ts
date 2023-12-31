import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt: Date | string): string => {
  const currentDate = new Date();
  // added code
  if (typeof createdAt === 'string') {
    createdAt = new Date(createdAt);
  }
  const timeDifference = currentDate.getTime() - createdAt.getTime();
  
  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  // Determine which time unit to use based on the time difference
  if (timeDifference < minute) {
    const secondsAgo = Math.floor(timeDifference / 1000);
    return `${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < hour) {
    const minutesAgo = Math.floor(timeDifference / minute);
    return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < day) {
    const hoursAgo = Math.floor(timeDifference / hour);
    return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < week) {
    const daysAgo = Math.floor(timeDifference / day);
    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < month) {
    const weeksAgo = Math.floor(timeDifference / week);
    return `${weeksAgo} week${weeksAgo !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < year) {
    const monthsAgo = Math.floor(timeDifference / month);
    return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
  } else {
    const yearsAgo = Math.floor(timeDifference / year);
    return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
  }
};

export const formatNumberWithPostfix = (number: number): string => {
  if (number >= 1000000000) {
    const formattedNumber = (number / 1000000000).toFixed(1);
    return `${formattedNumber}B`;
  } else if (number >= 1000000) {
    const formattedNumber = (number / 1000000).toFixed(1);
    return `${formattedNumber}M`;
  } else if (number >= 1000) {
    const formattedNumber = (number / 1000).toFixed(1);
    return `${formattedNumber}K`;
  } else {
    return `${number}`;
  }
};

export const truncateString = (inputString: string): string => {
  const maxLength = 12;
  if (inputString.length <= maxLength) {
    return inputString;
  }
  const truncatedString = inputString.slice(0, maxLength - 3) + '...';
  return truncatedString;
};

// convert date string
export function formatDateString(inputDateString: string): string {
  // Parse the input date string
  const parsedDate = new Date(inputDateString);

  // Check if the parsing was successful
  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  // Format the date in the desired format
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const month = monthNames[parsedDate.getMonth()];
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear();
  const hours = parsedDate.getHours();
  const minutes = parsedDate.getMinutes();

  // Determine whether it's AM or PM
  const amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 || 12;

  // Format the date string
  const formattedDateString = `${month} ${day}, ${year}, ${formattedHours}:${minutes} ${amOrPm}`;

  return formattedDateString;
}

// convert date string
export function formatToMonthAndYear(inputDateString: string): string {
  // Parse the input date string
  const parsedDate = new Date(inputDateString);

  // Check if the parsing was successful
  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  // Format the date in the desired format
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[parsedDate.getMonth()];
  // const day = parsedDate.getDate();
  const year = parsedDate.getFullYear();
  // const hours = parsedDate.getHours();
  // const minutes = parsedDate.getMinutes();

  // // Determine whether it's AM or PM
  // const amOrPm = hours >= 12 ? "PM" : "AM";

  // // Convert hours to 12-hour format
  // const formattedHours = hours % 12 || 12;

  // Format the date string
  const formattedDateString = `${month} ${year}`;

  return formattedDateString;
}

// Utility functions to add and remove keys to searchparams
interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null
};
interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
};

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl
  },
  { skipNull: true })
}

export const removeKeysFromQuery = ({ params, keysToRemove }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach(key => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl
  },
  { skipNull: true })
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[]
}
export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if(count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1; 
      }
    });
  });
  return badgeCounts;
}
