"use client"
import { Button } from "../ui/button";

interface TagProps {
  name: string;
  value: string;
};

const Tag = ({ name, value }: TagProps) => {
  return (
    <div className="">
      <Button className="background-light800_dark400 body-regular m-4 self-start">
        {name}
      </Button>
    </div>
  );
};

export default Tag;