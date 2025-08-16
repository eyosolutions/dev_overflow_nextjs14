import TagCard from "@/components/cards/TagCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import Filter from "@/components/shared/search/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Tags | DevOverflow',
}

const TagsPage = async ({ searchParams }: SearchParamsProps) => {
  const resolvedSearchParams = await searchParams;

  const result = await getAllTags({
    searchQuery: resolvedSearchParams.q,
    filter: resolvedSearchParams.filter,
    page: resolvedSearchParams.page ? +resolvedSearchParams.page : 1
  });
  // console.log();
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex w-full grow justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
        {/* <HomeFilters /> */}
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ?
        result.tags.map((tag) => (
          <TagCard
            key={tag._id}
            tag={tag}
          />
        )) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found"
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )
        }
      </section>
      <div className="mt-10">
        <Pagination
          pageNumber={resolvedSearchParams.page ? +resolvedSearchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default TagsPage;