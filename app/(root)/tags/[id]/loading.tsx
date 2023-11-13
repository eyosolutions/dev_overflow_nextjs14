import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Tag Name</h1>
      <div className="mt-11 flex w-full grow justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[3.5rem] w-full flex-1 grow" />
      </div>

      <section className="mt-10 flex w-full flex-col gap-6">
        {[1,2,3,4,5,6,7,8,9,10].map((item) => (
          <Skeleton
            key={item}
            className="card-wrapper h-48 w-full rounded-[10px] p-9 sm:px-11"
          />
        ))}
      </section>
    </div>
  );
};

export default Loading;
