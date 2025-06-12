import React from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const profile = useSelector((state) => state.auth.user?.profile || {});

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 capitalize">dashboard</h1>
      <div className="bg-neutral-950 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">
          Welcome back, {profile.firstName || "Buddy"}!
        </h2>
        <p className="text-neutral-400">
          This is your dashboard overview. Select a menu item to view specific sections.
        </p>
      </div>
    </Layout>
  );
};

export default Dashboard;
