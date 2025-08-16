import EditProfile from "@/components/forms/EditProfile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

const ProfileEditPage = async () => {
  const { userId } = await auth();

  if (!userId) return;

  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">
        Edit Profile
      </h1>
      <div className="mt-10">
        <EditProfile
          clerkId={userId}
          user={JSON.stringify(mongoUser)}
        />    
      </div>
    </div> 
  );
};

export default ProfileEditPage;
