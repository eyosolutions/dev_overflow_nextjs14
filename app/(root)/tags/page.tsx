import TagCard from "@/components/cards/TagCard";
import NoResult from "@/components/shared/NoResult";
import Filter from "@/components/shared/search/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";

const TagsPage = async ({ searchParams }: SearchParamsProps) => {

  const { tags } = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter
  });
  // console.log();
  return (
    <>
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
        {tags.length > 0 ?
        tags.map((tag) => (
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
    </>
  );
};

export default TagsPage;