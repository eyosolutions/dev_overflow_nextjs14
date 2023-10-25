import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
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
