// import RenderTag from "@/components/shared/RenderTag";
import GlobalSearch from "@/components/shared/search/GlobalSearch";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const categories = [
  { _id: 1, name: "Newest" },
  { _id: 2, name: "Recommended" },
  { _id: 3, name: "Frequent" },
  { _id: 4, name: "Unanswered" },
];

const Home = () => {
  return (
    <div className="ml-36 mr-60">
      <div className="mb-6 flex justify-between">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question">
          <Button className="primary-gradient min-h-[46px] rounded-lg px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div>
        <GlobalSearch />
      </div>
      <div className="mt-6 flex justify-start gap-3">
        {categories.map((category) => (
          <Link
            href=""
            key={category._id}
            className="background-light800_dark300 text-light400_light500 rounded-lg border-none px-4 py-2"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
