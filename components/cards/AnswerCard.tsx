import Link from "next/link";
import Metric from "../shared/Metric";
import { formatNumberWithPostfix, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface AnswerProps {
  _id: string;
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  question: {
    _id: string;
    title: string;
    createdAt: Date;
  };
  // createdAt: Date;
  clerkId?: string | null;
}

const AnswerCard = ({
  _id,
  clerkId,
  question,
  author,
  upvotes
}: AnswerProps) => {

  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(question.createdAt)}
          </span>
          <Link href={`/question/${question._id}`}>
            <h3 className="base-semibold sm:h3-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </Link>
        </div>
        {/* if signed in, add to edit delete actions */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction
              type="Answer"
              typeId={JSON.stringify(_id)}
            />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <div>
          <Metric
            imgUrl={author.picture}
            alt="User"
            value={author.name}
            title={` - asked ${getTimestamp(question.createdAt)}`}
            href={`/profile/${clerkId}`}
            isAuthor
            textStyles="body-medium text-dark400_light700"
          />
        </div>
        <div className="flex-between gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatNumberWithPostfix(upvotes)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
