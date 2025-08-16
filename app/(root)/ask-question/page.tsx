import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Ask | DevOverflow',
}

const AskQuestion = async () => {
  const { userId } = await auth();
  
  if (!userId) redirect('/sign-in');

  const mongoUser = await getUserById({ userId });
  
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">
        Ask a question
      </h1>
      <div className="mt-9">
        <Question type="Create" mongoUserId={JSON.stringify(mongoUser?._id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
