import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

const EditQuestionPage = async ({ params }: ParamsProps) => {
  const { userId } = await auth();
  const resolvedParams = await params;
  // console.log('auth-Id: ', userId);
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  
  const { question } = await getQuestionById({ questionId: resolvedParams.id });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">
        Edit Question
      </h1>
    <div className="mt-9">
      <Question
        type="Edit"
        questionDetails={JSON.stringify(question)}
        mongoUserId={JSON.stringify(mongoUser?._id)} />
    </div>
    </div>
  );
};

export default EditQuestionPage;
