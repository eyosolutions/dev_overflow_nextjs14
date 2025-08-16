import { Skeleton } from '@/components/ui/skeleton';

const LoadingCommunity = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex w-full grow justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[3.5rem] w-full flex-1 grow" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {[1,2,3,4,5,6,7,8,9,10].map((item) => (
          <Skeleton
            key={item}
            className="h-[283px] rounded-2xl max-xs:min-w-full xs:w-[260px]"
          />
        ))}
      </section>
    </div>
  );
};

export default LoadingCommunity;
