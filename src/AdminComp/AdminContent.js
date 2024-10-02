import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminContent = () => {
  const [counts, setCounts] = useState({
    mcsOfficers: 0,
    aisOfficers: 0,
    gomOfficers: 0,
    govtOfficesContacts: 0,
    revenueForum: 0,
    newsCount: 0,
    departmentInfo: 0,
    todaysJoining: 0,
    todaysBirthday: 0,
  });

  const [joiners, setJoiners] = useState([]); // State to store today's joiners
  const [birthdays, setBirthdays] = useState([]); // State to store today's birthdays

  const fetchCounts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/counts");
      setCounts(response.data);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const fetchJoiners = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/mcs/todays-joinings");
      setJoiners(response.data); // Assuming the response data is an array of names
    } catch (error) {
      console.error("Error fetching joiners:", error);
    }
  };

  const fetchBirthdays = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/mcs/birthdays");
      setBirthdays(response.data); // Assuming the response data is an array of objects
    } catch (error) {
      console.error("Error fetching birthdays:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchJoiners();
    fetchBirthdays();
    const interval = setInterval(() => {
      fetchCounts();
      fetchJoiners();
      fetchBirthdays(); // Refresh birthdays as well
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card title="Total MCS Officers" count={counts.mcsOfficers} />
      <Card title="Total AIS Officers" count={counts.aisOfficers} />
      <Card title="Total GOM Officers" count={counts.gomOfficers} />
      <Card title="Total Govt Offices" count={counts.govtOfficesContacts} />
      <Card title="Total Revenue Forum" count={counts.revenueForum} />
      <Card title="Total News" count={counts.newsCount} />
      <Card title="Total Department Info" count={counts.departmentInfo} />
      
      <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg text-white">
        <h2 className="text-xl font-bold">Today's Joining</h2>
        <p className="text-2xl">{counts.todaysJoining}</p>
        <ul>
          {joiners.map((name, index) => (
            <li key={index} className="text-lg">
              <p>🎉 Wishing all the best to the new joiner {name}!</p>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-pink-400 to-purple-500 p-6 rounded-lg text-white">
        <h2 className="text-xl font-bold">Today's Birthday</h2>
        <p className="text-2xl">{counts.todaysBirthday}</p>
        <ul>
          {birthdays.map((birthday, index) => (
            <li key={index} className="text-lg">
              <p>🎉 Happy Birthday to {birthday.name}!</p> {/* Render only the name */}
            </li>
          ))}
        </ul>
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
