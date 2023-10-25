import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { ParamsProps } from "@/types";

const TagDetailPage = async ({ params }: ParamsProps) => {

  const result = await getQuestionsByTagId({ tagId: params.id });

  // console.log('Tag: ', result.questions.length);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.name}</h1>
      <div className="mt-11 flex w-full grow">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search amazing minds here..."
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (           
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />            
          ))
        ) : (
          <NoResult
            title="No Questions Associated with this Tag"
            description="It appears that there are no questions associated with this Tag 😔. Check other tags or add a tag by asking a question.🌟"
            link="/tags"
            linkTitle="Explore Other Tags"
          />
        )}
      </div>
    </>
  );
};

export default TagDetailPage;