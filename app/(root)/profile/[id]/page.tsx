
// import QuestionCard from "@/components/cards/QuestionCard";
// import RenderTag from "@/components/shared/RenderTag";
// import UserPosts from "@/components/shared/UserPosts";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
// import { formatToMonthAndYear } from "@/lib/utils";
import { URLProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatToMonthAndYear } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswersTab from "@/components/shared/AnswersTab";


const UserProfilePage = async ({ params, searchParams }: URLProps) => {
  // Adrian's version
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user.picture}
            alt="Profile Picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{userInfo?.user.name}</h2>
            <p className="paragraph-regular text-dark200_light800">@{userInfo?.user.username}</p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}
              {userInfo.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={`Joined ${formatToMonthAndYear(userInfo.user.joinedAt)}`}
              />
            </div>
            {userInfo.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="mt-3 flex justify-end max-sm:mb-5 max-sm:w-full">
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href={`/profile/edit`}>
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">Edit Profile</Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
        badges={userInfo?.badgeCounts}
        reputation={userInfo?.reputation}
      />

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab rounded-md">Top Posts</TabsTrigger>
            <TabsTrigger value="answers" className="tab rounded-md">Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswersTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default UserProfilePage;

    // <div className="flex w-full flex-col gap-5">
    //   <div className="flex justify-between">
    //     <div className="flex gap-4">
    //       <Image
    //         src={user.picture}
    //         alt="Profile Picture"
    //         width={140}
    //         height={140}
    //         className="rounded-full"
    //       />
    //       <div className="mt-3">
    //         <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
    //         <p className="paragraph-regular text-dark200_light800">@{user.username}</p>
    //         <div className="mt-5 flex items-center gap-1">
    //           <Image
    //             src="/assets/icons/calendar.svg"
    //             alt="Calendar"
    //             width={20}
    //             height={20}
    //           />
    //           <p className="paragraph-medium text-dark400_light700">Joined {formatToMonthAndYear(user.joinedAt)}</p>
    //         </div>
    //       </div>
    //     </div>
    //     <Link href={`/profile/edit`}>
    //       <Button className="background-light900_dark300 text-dark200_light900 mt-3 min-h-[46px] min-w-[175px] px-4 py-3">Edit Profile</Button>
    //     </Link>
    //   </div>
      
    //   <div className="mt-5 flex w-full flex-col">
    //     <h4 className="h3-semibold text-dark200_light900">Stats</h4>
    //     <div className="mt-5 grid grid-cols-4 gap-5 max-md:grid-cols-2">
    //       <div className="background-light900_dark300 light-border flex flex-wrap items-center justify-evenly gap-6 rounded-md border p-6">
    //         <div>
    //           <p className="paragraph-semibold text-dark200_light900">{questions.length}</p>
    //           <p className="body-medium text-dark400_light700">Questions</p>
    //         </div>
    //         <div>
    //           <p className="paragraph-semibold text-dark200_light900">{answers.length}</p>
    //           <p className="body-medium text-dark400_light700">Answers</p>
    //         </div>
    //       </div>

    //       <div className="background-light900_dark300 light-border flex flex-col justify-center gap-4 rounded-md border p-6 max-md:flex-row">
    //         <Image
    //           src="/assets/icons/gold-medal.svg"
    //           alt="Gold Medal"
    //           width={40}
    //           height={50}
    //         />
    //         <div>
    //           <p className="paragraph-semibold text-dark200_light900">{questions.length}</p>
    //           <p className="body-medium text-dark400_light700">Gold Badges</p>
    //         </div>
    //       </div>

    //       <div className="background-light900_dark300 light-border flex flex-col justify-center gap-4 rounded-md border p-6 max-md:flex-row">
    //         <Image
    //           src="/assets/icons/silver-medal.svg"
    //           alt="Silver Medal"
    //           width={40}
    //           height={50}
    //         />
    //         <div>
    //           <p className="paragraph-semibold text-dark200_light900">{questions.length}</p>
    //           <p className="body-medium text-dark400_light700">Silver Badges</p>
    //         </div>
    //       </div>

    //       <div className="background-light900_dark300 light-border flex flex-col justify-center gap-4 rounded-md border p-6 max-md:flex-row">
    //         <Image
    //           src="/assets/icons/bronze-medal.svg"
    //           alt="Bronze Medal"
    //           width={40}
    //           height={50}
    //         />
    //         <div>
    //           <p className="paragraph-semibold text-dark200_light900">{questions.length}</p>
    //           <p className="body-medium text-dark400_light700">Bronze Badges</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="mt-5 flex w-full gap-10">
    //     <UserPosts
    //       questions={JSON.stringify(questions)}
    //       answers={JSON.stringify(answers)}
    //       user={JSON.stringify(user)}
    //     />
    //   </div>
    // </div>