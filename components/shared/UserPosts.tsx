"use client"

import { Button } from "../ui/button";
import QuestionCard from "../cards/QuestionCard";
import RenderTag from "./RenderTag";
import { useState } from "react";
import { formatNumberWithPostfix, getTimestamp } from "@/lib/utils";
import Link from "next/link";
import Metric from "./Metric";


interface Props {
  questions: any;
  answers: any;
  user: any;
}

const UserPosts = ({ questions, answers, user }: Props) => {
  const [isTopPost, setIsTopPost] = useState(true);

  const parsedQuestions = JSON.parse(questions);
  const parsedAnswers = JSON.parse(answers);
  const parsedUser = JSON.parse(user);

  // console.log(parsedAnswers);

  const togglePostAndAnswer = () => {

    setIsTopPost(!isTopPost);

  };
  

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 max-lg:flex-col">
        <div className="background-light800_dark400 flex min-h-[42px] w-[175px] items-center justify-center rounded-lg">
          <Button
            onClick={togglePostAndAnswer}
            type="button"
            role="tab"
            className={`text-light400_light500 body-medium ml-1 h-9 whitespace-nowrap rounded-md px-3 ${isTopPost ? 'background-light800_dark300 text-primary-500' : ''}`}
          >
            Top Posts
          </Button>
          <Button
            onClick={togglePostAndAnswer}
            type="button"
            role="tab"
            className={`text-light400_light500 body-medium mr-1 h-9 whitespace-nowrap rounded-md px-3 ${!isTopPost ? 'background-light800_dark300 text-primary-500' : ''}`}
          >
            Answers
          </Button>
        </div>
        <div className="flex flex-col gap-6">
          {isTopPost
          ? (parsedQuestions.length > 0 && (
            parsedQuestions.map((question: any) => (
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
          ))
          : (parsedAnswers.length > 0 && (
            parsedAnswers.map((answer: any) => (
              <>
                <Link href={`/question/${answer.question._id}`} className="card-wrapper rounded-[10px] p-9 sm:px-11">
                  <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
                    <div>
                      <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
                        {getTimestamp(answer.question.createdAt)}
                      </span>
                      <h3 className="base-semibold sm:h3-semibold text-dark200_light900 line-clamp-1 flex-1">
                        {answer.question.title}
                      </h3>
                    </div>
                    {/* if signed in, add to edit delete actions */}
                  </div>

                  <div className="flex-between mt-6 w-full flex-wrap gap-3">
                    <div>
                      <Metric
                        imgUrl={parsedUser.picture}
                        alt="User"
                        value={answer.question.author.name}
                        title={` - asked ${getTimestamp(answer.question.createdAt)}`}
                        href={`/profile/${answer.question.author._id}`}
                        isAuthor
                        textStyles="body-medium text-dark400_light700"
                      />
                    </div>
                    <div className="flex-between gap-3">
                      <Metric
                        imgUrl="/assets/icons/like.svg"
                        alt="Upvotes"
                        value={formatNumberWithPostfix(answer.question.upvotes.length)}
                        title=" Votes"
                        textStyles="small-medium text-dark400_light800"
                      />
                    </div>
                  </div>
                </Link>
              </>
            ))
          ))
          }
        </div>
      </div>
      {/* <div className="flex min-w-[278px] flex-col gap-5 max-lg:hidden"> */}
      <div className="flex min-w-[200px] flex-col gap-5 max-lg:hidden">
        <h3 className="h3-semibold text-dark200_light900">Top Tags</h3>
        <div className="flex flex-col gap-2">
        {parsedQuestions.length > 0 && (
            parsedQuestions.map((question: any) => (
              question.tags.map((tag: any) => (
                <RenderTag
                  key={tag._id}
                  _id={tag._id}
                  name={tag.name}
                  totalQuestions={tag.questions.length}
                  showCount
                />
              ))
            ))
          )}
        </div>
      </div>
    </>
  )     
};

export default UserPosts;