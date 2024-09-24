import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminContent = () => {
  const [counts, setCounts] = useState({
    mcsOfficers: 0,
    iasOfficers: 0,
    otherGovtOffices: 0,
    govtOffices: 0,
    revenueForum: 0,
    news: 0,
    departmentInfo: 0,
    todaysJoining: 0,
    todaysBirthday: 0,
  });

  const fetchCounts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/counts");
      setCounts(response.data);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };
  

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card title="Total MCS Officers" count={counts.mcsOfficers} />
      <Card title="Total AIS Officers" count={counts.iasOfficers} />
      <Card title="Total Other Govt Offices" count={counts.otherGovtOffices} />
      <Card title="Total Govt Offices" count={counts.govtOffices} />
      <Card title="Total Revenue Forum" count={counts.revenueForum} />
      <Card title="Total News" count={counts.news} />
      <Card title="Total Department Info" count={counts.departmentInfo} />
      <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg text-white">
        <h2 className="text-xl font-bold">Today's Joining</h2>
        <p className="text-2xl">{counts.todaysJoining}</p>
        <p>🎉 Wishing all the best to the new joiners!</p>
      </div>
      <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-pink-400 to-purple-500 p-6 rounded-lg text-white">
        <h2 className="text-xl font-bold">Today's Birthday</h2>
        <p className="text-2xl">{counts.todaysBirthday}</p>
        <p>🎉 Happy Birthday to all celebrating today!</p>
      </div>
    </div>
  );
};

const Card = ({ title, count }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-2xl">{count}</p>
    </div>
  );
};

export default AdminContent;
