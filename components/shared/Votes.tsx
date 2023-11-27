"use client"
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { downvoteQuestion, upvoteQuestion } from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatNumberWithPostfix } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { useEffect } from "react";
import { updateQuestionViews } from "@/lib/actions/interaction.action";

interface Props {
  type: string;
  typeId: string;
  authorId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
};

const Votes = ({ type, typeId, authorId, upvotes, hasUpvoted, downvotes, hasDownvoted, hasSaved }: Props) => {

  const pathname = usePathname();
  const router = useRouter();
  // const { toast } = useToast();

  const handleSave = async () => {
    if (!authorId) {
      return toast({
        title: 'Please log in',
        description: `You must be logged in to perform this action`,
        // className: 'subtle-medium text-dark400_light900 background-light700_dark400',
      })
    }
    
    await toggleSaveQuestion({
      userId: JSON.parse(authorId),
      questionId: JSON.parse(typeId),
      path: pathname
    });
    return toast({
      // Question saved in your collection
      variant: `${!hasSaved ? 'default' : 'destructive'}`,
      title: `Question ${!hasSaved ? 'saved to' : 'removed from'} your collection`,
      // className: 'subtle-medium text-dark400_light900 background-light700_dark400',
    })
  }


  // handling upvote and downvote of questions and answers
  const handleVote = async (action: string) => {
    if (!authorId) {
      return toast({
        title: 'Please log in',
        description: `You must be logged in to perform this action`,
        // className: 'subtle-medium text-dark400_light900 background-light700_dark400',
      })
    }

    const objectParams = {
      userId: JSON.parse(authorId),
      hasupVoted: hasUpvoted,
      hasdownVoted: hasDownvoted,
      path: pathname
    };

    if (action === "upvote") {
      if (type === "question") {
        await upvoteQuestion({ questionId: JSON.parse(typeId), ...objectParams, });
      } else if (type === "answer") {
        await upvoteAnswer({ answerId: JSON.parse(typeId), ...objectParams, });
      }
      return toast({
        variant: `${!hasUpvoted ? 'default' : 'destructive'}`,
        title: `Upvote ${!hasUpvoted ? 'Successful' : 'Removed'}`,
        // className: 'subtle-medium text-dark400_light900 background-light700_dark400',
      })
    }

    if (action === "downvote") {
      if (type === "question") {
        await downvoteQuestion({ questionId: JSON.parse(typeId), ...objectParams, });
      } else if (type === "answer") {
        await downvoteAnswer({ answerId: JSON.parse(typeId), ...objectParams, });
      }
      return toast({
        variant: `${!hasDownvoted ? 'default' : 'destructive'}`,
        title: `Downvote ${!hasDownvoted ? 'Successful' : 'Removed'}`,
        // className: 'subtle-medium text-dark400_light900 background-light700_dark400',
      })
    }
  }

  // Updating question views
  useEffect(() => {
    const fetchViews = async () => {
      try {
        await updateQuestionViews({
          userId: authorId ? JSON.parse(authorId) : undefined,
          questionId: JSON.parse(typeId)
        });
        
      } catch (error) {
        console.error('Error updating views: ', error);
      }
    }

    fetchViews();

  }, [authorId, typeId, pathname, router])

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={hasUpvoted ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"}
            alt="upvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote('upvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{formatNumberWithPostfix(upvotes)}</p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={hasDownvoted ? "/assets/icons/downvoted.svg" : "/assets/icons/downvote.svg"}
            alt="downvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote('downvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{formatNumberWithPostfix(downvotes)}</p>
          </div>
        </div>
      </div>
      {type === "question" && (
        <Image
          src={hasSaved ? "/assets/icons/star-filled.svg" : "/assets/icons/star-red.svg"}
          alt="star"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => handleSave()}
        />
      )}

  </div>
  );
};

export default Votes;
