import { URLProps } from "@/types";
import { getQuestionById } from "@/lib/actions/question.action";
import Link from "next/link";
import RenderTag from "@/components/shared/RenderTag";
import Image from "next/image";
import ParseHTML from "@/components/shared/ParseHTML";
import AnswerForm from "@/components/forms/Answer";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";
import Metric from "@/components/shared/Metric";
import { formatNumberWithPostfix, getTimestamp } from "@/lib/utils";
import ViewsMetric from "@/components/shared/ViewsMetric";

const DetailQuestionPage = async ({ params, searchParams }: URLProps) => {

  const { userId: clerkId } = auth();
 
  const { question } = await getQuestionById({ questionId: params.id });
  
  let mongoUser: any;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <section>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center gap-1"
          >
            <Image
              src={question.author.picture}
              alt="Profile"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">{question.author.name}</p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              typeId={JSON.stringify(question._id)}
              authorId={JSON.stringify(mongoUser?._id)}
              upvotes={question.upvotes.length}
              hasUpvoted={question.upvotes.includes(mongoUser?._id)}
              downvotes={question.downvotes.length}
              hasDownvoted={question.downvotes.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>

      {/* Metrics for Questions */}
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(question.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Message"
          value={formatNumberWithPostfix(question.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <ViewsMetric
          typeViews={question.views}
          typeId={JSON.stringify(question._id)}
        />
      </div>

      {/* displaying content of question */}
      <ParseHTML data={question.content} />

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.length > 0 ? (
          question.tags.map((tag: { _id: string; name: string; }) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={false}
            />
          ))
        ) : (
          <RenderTag _id="1" name="No tags yet" />
        )}
      </div>

      {/* Server component that renders Votes component as well */}
      <AllAnswers
        questionId={question._id}
        authorId={mongoUser?._id}
        totalAnswers={question.answers.length}
        filter={searchParams.filter}
        page={searchParams.page ? +searchParams.page : 1}
      />
      {/* Client component causes rendering of page */}
      <AnswerForm
        question={question.content}
        questionId={JSON.stringify(question._id)}
        authorId={JSON.stringify(mongoUser?._id)}
      />
    </section>
  );
};

export default DetailQuestionPage;
