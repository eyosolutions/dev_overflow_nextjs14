import JobCard from "@/components/cards/JobCard";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import LocationFilter from "@/components/shared/search/LocationFilter";
import { getAllJobsOrByFilter, getCountries, getUserCountry } from "@/lib/actions/general.action";
import { SearchParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Jobs | DevOverflow',
}

const JobsPage = async ({ searchParams }: SearchParamsProps) => {
  // const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rest-countries`);
  const response = await getCountries();
  const { countries } = await response.json();
  const sortedCountries = countries.slice().sort((a: any, b: any) => a.name.localeCompare(b.name));

  const userIP = await getUserCountry();
  const { userCountry } = await userIP.json();

  const result = await getAllJobsOrByFilter({
    searchQuery: searchParams.q || "",
    location: searchParams.location || userCountry.country,
    page: searchParams.page ? +searchParams.page : 1
  });

  const { searchedJobs, isNext } = await result.json();
  const countryName = searchParams.location || userCountry.country;
  const searchedCountry = sortedCountries.find((country: any) => country.name === countryName);

  // const sortedCountries = countries
  // .map((country: any) => country.name)
  // .sort()
  // .map((country: string) => ({ name: country, value: country }));

  // console.log(sortedCountries);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="mt-11 flex w-full grow justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/jobs"
          iconPosition="left"
          imgSrc="/assets/icons/job-search.svg"
          placeholder="Job Title, Company, or Keywords"
          otherClasses="flex-1"
        />
        <LocationFilter 
          countriesFilter={sortedCountries}
        />
      </div>
      <div className="mt-11 flex w-full flex-col gap-10">
        {searchedJobs?.status === 'OK' ? 
          searchedJobs?.data.length > 0 ?
            searchedJobs?.data.map((item: any) => (
              <JobCard
                key={item.job_id}
                jobLogo={item.employer_logo}
                flag={searchedCountry.flag}
                title={item.job_title}
                city={item.job_city}
                state={item.job_state}
                countryCode={item.job_country}
                description={item.job_description}
                jobType={item.job_employment_type}
                applyLink={item.job_apply_link}
                companyWebsite={item.employer_website}
                datePosted={item.job_posted_at_datetime_utc}
              />
            ))
          :
          <div className="flex justify-center">
            <p className="paragraph-regular text-dark400_light800">Oops! We couldn&apos;t find any jobs at the moment. Please try again later</p>
          </div>
        :
        <div className="flex justify-center">
          <p className="paragraph-regular text-dark400_light800">Oops! An error occured in searching for jobs</p>
        </div>
        }
      </div>
      {/* Separator */}

      {/* Pagination */}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
};

export default JobsPage;
