import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt: Date): string => {
  const currentDate = new Date();
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