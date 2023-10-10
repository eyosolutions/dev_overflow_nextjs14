import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "newest";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 self-start md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          className={`body-medium h-9 rounded-lg px-6 py-3 capitalize shadow-none ${active === item.value
            ? 'bg-primary-100 text-primary-500 dark:bg-dark-400'
            : 'bg-light-800 text-light-500 dark:bg-dark-300'
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;