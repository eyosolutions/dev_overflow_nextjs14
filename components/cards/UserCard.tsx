import Image from "next/image";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    name: string;
    username: string;
    picture: string;
  }
}

const UserCard = async ({ user }: UserCardProps) => {

  // const id = JSON.stringify(user._id);

  const tags = await getTopInteractedTags({ userId: user._id });
    
  return (
      <article className="shadow-light100_darknone background-light900_dark200 light-border relative flex flex-col items-center justify-center rounded-2xl border max-xs:min-w-full xs:w-[260px]">
        <Link href={`/profile/${user.clerkId}`} className="flex w-full flex-col items-center pb-12">
          <Image
            src={user.picture}
            alt="user profile picture"
            width={100}
            height={100}
            className="mt-8 rounded-full"
          />
          <div className="mb-8 mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">{user.name}</h3>
            <p className="body-regular text-dark500_light500 mt-2">@{user.username}</p>
          </div>
        </Link>
        <div className="absolute bottom-8 left-auto">
          {tags.length > 0 ? (
            <div className="flex items-center gap-2">
              {tags.map((tag) => (
                <RenderTag
                  key={tag._id}
                  _id={tag._id}
                  name={tag.name}
                />
              ))}
            </div>
          ) : (
            <RenderTag _id="1" name="No tags yet" />
          )}
        </div>
      </article>
  );
};

export default UserCard;