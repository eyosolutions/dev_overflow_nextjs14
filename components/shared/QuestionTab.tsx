import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ userId, clerkId, searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const result = await getUserQuestions({ userId, page: resolvedSearchParams.page ? +resolvedSearchParams.page : 1 });
  return (
    <div>
      <div className="mt-5 flex flex-col gap-6">
        {result?.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            clerkId={clerkId}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes.length}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={resolvedSearchParams.page ? +resolvedSearchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default QuestionTab;
