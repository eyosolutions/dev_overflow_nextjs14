// import RenderTag from "@/components/shared/RenderTag";
import Filter from "@/components/shared/search/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
// import QuestionCard from "@/components/home/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "How to write a TypeScript interface?",
    tags: [
      { _id: "1", name: "typescript" },
      { _id: "2", name: "programming" },
    ],
    author: {
      _id: "1",
      name: "Sujata | JS Mastery",
      picture: "alice.jpg",
    },
    upvotes: 1500000000,
    views: 2000000,
    answers: [],
    createdAt: new Date("2023-01-15"),
  },
  {
    _id: "2",
    title: "What are the benefits of using TypeScript?",
    tags: [
      { _id: "3", name: "typescript" },
      { _id: "4", name: "javascript" },
    ],
    author: {
      _id: "2",
      name: "Bob Johnson",
      picture: "bob.jpg",
    },
    upvotes: 20,
    views: 2500,
    answers: [],
    createdAt: new Date("2023-02-20"),
  },
  {
    _id: "3",
    title: "How to use TypeScript with React?",
    tags: [
      { _id: "5", name: "typescript" },
      { _id: "6", name: "react" },
    ],
    author: {
      _id: "3",
      name: "Eve Brown",
      picture: "eve.jpg",
    },
    upvotes: 12,
    views: 180,
    answers: [],
    createdAt: new Date("2023-10-10"),
  },
];

const Home = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      {/* <div className="mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center"></div> */}
      <div className="mt-11 flex w-full grow justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col md:gap-0">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
        <HomeFilters />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ?
          questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
          ))
          : <NoResult
              title="There&apos;s no question to show"
              description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
              link="/ask-question"
              linkTitle="Ask a Question"
            />
        }
      </div>
    </>
  );
};

export default Home;
