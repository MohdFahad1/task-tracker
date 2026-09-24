import { UserButton } from "@clerk/nextjs";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>

      <UserButton />
    </div>
  );
};

export default Dashboard;