import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">
        Ask a question
      </h1>
      <div className="mt-9 flex w-full flex-col gap-10">
        <Skeleton className="mt-3.5 min-h-[56px]" />
        <Skeleton className="mt-16 min-h-[350px]" />
        <Skeleton className="mt-16 min-h-[56px]" />
      </div>
    </section>
  );
};

export default Loading;
