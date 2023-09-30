import { UserButton } from '@clerk/nextjs';

const Home = () => {
  return (
    <div>
      <h1 className='h1-bold'>This is a global layout text</h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Home;
