import { Skeleton } from "@/components/ui/skeleton";

const LoadingTags = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex w-full grow justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[3.5rem] w-full flex-1 grow" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {[1,2,3,4,5,6,7,8,9,10].map((item) => (
          <Skeleton
            key={item}
            className="h-[244px] rounded-2xl px-8 py-10 sm:w-[260px]"
          />
        ))}
      </section>
    </>
  );
};

export default LoadingTags;
