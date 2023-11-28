import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface JobCardProps {
  jobLogo: string;
  flag: string;
  title: string;
  city: string;
  state: string;
  countryCode: string;
  description: string;
  jobType: string;
  applyLink: string;
  companyWebsite: string;
  datePosted: Date;
};

const JobCard = ({ jobLogo, flag, title, city, state, countryCode, description, jobType, applyLink, datePosted, companyWebsite }: JobCardProps) => {
  // const location = `${(city + ',' || "")} ${state + ',' || ""} ${countryCode}`;
  const location = [city, state, countryCode].filter(Boolean).join(', ');

  return (
    <div className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
      {/* Main div */}
      {/* <div className="flex gap-6 max-sm:w-full max-sm:flex-col max-sm:gap-5">

      </div> */}
      <div className="flex max-sm:w-full max-sm:flex-col-reverse max-sm:gap-4">
        {jobLogo ?
          <Link 
            href={companyWebsite || "/jobs"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="background-light800_dark400 h-16 w-16 rounded-xl"
          >
            <Image
              src={jobLogo}
              alt='job-logo'
              width={64}
              height={64}
              className="h-full w-full bg-transparent object-contain p-2"
            />
          </Link>
        : 
          <Image
            src={'/assets/images/site-logo.svg'}
            alt='default-site-logo'
            width={64}
            height={64}
          />
        }
        <div className="background-light800_dark400 flex items-center justify-center gap-2 rounded-2xl px-2.5 py-1.5 max-sm:self-end sm:hidden">
          <Image
            src={flag}
            alt="country-flag"
            width={16}
            height={16}
            className="rounded-full"
          />
          <p className="body-medium text-dark400_light700">{location.trim()}</p>
        </div>
      </div>
      {/* Inner div adjacent to main Image */}
      <div className="flex w-full flex-col gap-3">
        {/* div for title and location div */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 max-sm:flex-col max-sm:items-start max-sm:gap-3">
          <p className="base-semibold text-dark200_light900">{title}</p>
          <div className="background-light800_dark400 flex items-center justify-center gap-2 self-end rounded-2xl px-2.5 py-1.5 max-sm:hidden">
            <Image
              src={flag}
              alt="country-flag"
              width={16}
              height={16}
              className="rounded-full"
            />
            <p className="body-medium text-dark400_light700">{location}</p>
          </div>
        </div>
        <div>
          <p className="body-medium text-dark400_light700 line-clamp-2">{description}</p>
        </div>
        <div className="mt-5 flex flex-wrap justify-between gap-6">
          <div className="flex flex-wrap items-center justify-start gap-6">
            <div className="flex gap-2">
              <Image
                src="/assets/icons/clock-2.svg"
                alt="suitcase"
                width={20}
                height={20}
              />
              <p className="body-medium uppercase text-light-500">{jobType}</p>
            </div> 
            <div className="flex gap-2">
              <Image
                src="/assets/icons/currency-dollar-circle.svg"
                alt="clock"
                width={20}
                height={20}
              />
              <p className="body-medium text-light-500">Not disclosed</p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/assets/icons/clock-2.svg"
                alt="clock"
                width={20}
                height={20}
              />
              <p className="body-medium text-light-500">{formatDateString(datePosted.toString())}</p>
            </div>
          </div>
          <Link href={applyLink || "/jobs"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-end gap-2">
            <p className="body-semibold primary-text-gradient">View job</p>
            <Image
              src='/assets/icons/arrow-up-right.svg'
              alt="right-up-arrow"
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
