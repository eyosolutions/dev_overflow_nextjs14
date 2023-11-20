import { getAnswersPerQuestion } from "@/lib/actions/answer.action";
import Filter from "./search/Filter";
import { AnswerFilters } from "@/constants/filters";
import Link from "next/link";
import Image from "next/image";
import { formatDateString } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";

interface Props {
  questionId: string;
  authorId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({ questionId, authorId, totalAnswers, page, filter }: Props) => {
  
  const result = await getAnswersPerQuestion({ questionId, sortBy: filter, page: page ? +page : 1 })
  
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filter
          filters={AnswerFilters}
        />
      </div>
      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="flex items-baseline justify-between">
              {/* SPAN ID to be implemented */}
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    alt="Profile"
                    width={18}
                    height={18}
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">{answer.author.name}</p>
                    <p className="small-regular text-dark400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      answered {" "} {formatDateString(answer.createdAt)}
                    </p>
                  </div>
                </Link>
              </div>
              {/* Add Votes component */}
              <Votes
                type="answer"
                typeId={JSON.stringify(answer._id)}
                authorId={JSON.stringify(authorId)}
                upvotes={answer.upvotes.length}
                hasUpvoted={answer.upvotes.includes(authorId)}
                downvotes={answer.downvotes.length}
                hasDownvoted={answer.downvotes.includes(authorId)}
              />
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      {/* Pagination */}
      <div className="mb-20 mt-10">
        <Pagination
          pageNumber={page ? +page : 1}
          isNext={result?.isNext}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
