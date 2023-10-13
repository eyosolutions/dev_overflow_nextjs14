"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterProps {
  filters: {
    name: string, 
    value: string
  }[];
  otherClasses?: string;
  containerClasses?: string;
};

const Filter = ({ filters, otherClasses, containerClasses }: FilterProps) => {
  return (
    //  className="background-light800_dark300 flex h-[3.5rem] grow max-sm:items-stretch md:hidden"
    <div className={`relative ${containerClasses}`}>
      <Select>
        {/* className="w-[180px]" */}
        <SelectTrigger className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>         
        </SelectTrigger>
        <SelectContent className="background-light800_darkgradient text-dark100_light900">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}       
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;