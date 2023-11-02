import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
};

const AnswersTab = async ({ userId, clerkId, searchParams }: Props) => {
  const result = await getUserAnswers({ userId, page: searchParams.page ? +searchParams.page : 1 });

  return (
    <>
      <div className="mt-5 flex flex-col gap-6">
        {result.answers.map((answer) => (
          <AnswerCard
            key={answer._id}
            _id={answer._id}
            clerkId={clerkId}
            question={answer.question}
            author={answer.author}
            upvotes={answer.upvotes.length}
          />
          // console.log('Result: ', answer.question)
        ))}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default AnswersTab;