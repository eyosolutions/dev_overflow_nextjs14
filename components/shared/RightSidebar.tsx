import React from 'react';
import { popularTags, topQuestions } from "@/constants";
import Link from 'next/link';
import Image from 'next/image';
import RenderTag from './RenderTag';

const RightSidebar = () => {
  return (
    <div className="background-light900_dark200 light-border custom-scrollbar fixed right-0 top-0 flex h-screen flex-col gap-20 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden max-sm:hidden lg:w-[350px]">
      <div>
        <h3 className="text-dark200_light900 h3-bold">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {topQuestions.map((question) => (
            <Link
            href={`/questions/${question._id}`}
            key={question._id}
            className="flex cursor-pointer items-center justify-between gap-7"
          >
            <p className="body-medium text-dark500_light700">{question.title}</p>
            <Image
              src="/assets/icons/chevron-right.svg"
              alt="chevron right"
              width={20}
              height={20}
              className="invert-colors"
            />
          </Link>
          ))}
        </div>
      </div>
      {/* Popular Tags */}
      <div className="mt-2">
        <h3 className="text-dark200_light900 h3-bold">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
      {/* <div className="flex flex-1 flex-col justify-start gap-6">
        <p className="text-dark300_light900 text-xl font-bold text-light-900">Popular Tags</p>
        {popularTags.map((item) => {
            return (
              <Link href="" key={item.tag} className="text-dark300_light900 flex items-start justify-between gap-6">
                <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 rounded-md">{item.tag}</Button>
                <p className="text-sm">{item.vote}</p>
              </Link>
            )
          })}
      </div> */}
    </div>
  );
};

export default RightSidebar;