import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSyncAlt, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const MainDepartmentMaster = () => {
  const [mainDepartments, setMainDepartments] = useState([]);
  const [formState, setFormState] = useState({ mainDept: "", id: null });
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/mainDepartments");
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setMainDepartments(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleAddMainDepartment = async () => {
    console.log("Form State Before Submission:", formState); // Debugging statement
    if (!formState.mainDept) {
      console.error("Main department is required");
      return; // Prevent submission if mainDept is empty
    }

    try {
      const response = formState.id 
        ? await axios.put(`http://localhost:8080/api/mainDepartments/${formState.id}`, {
            mainDept: formState.mainDept,
            status: formState.status,
          })
        : await axios.post("http://localhost:8080/api/mainDepartments", {
            mainDept: formState.mainDept,
            status: false,
          });

      const updatedDepartments = formState.id 
        ? mainDepartments.map((dept) => (dept.id === response.data.id ? response.data : dept)) 
        : [...mainDepartments, response.data];

      setMainDepartments(updatedDepartments);
      setFormState({ mainDept: "", id: null }); // Reset form state
    } catch (error) {
      console.error("Error adding/updating department", error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (id) => {
    const dept = mainDepartments.find((d) => d.id === id);
    setFormState({ mainDept: dept.mainDept, id: dept.id, status: dept.status });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/mainDepartments/${id}`);
      setMainDepartments(mainDepartments.filter((dept) => dept.id !== id));
    } catch (error) {
      console.error("Error deleting department", error);
    }
  };

  const toggleStatus = async (id) => {
    const dept = mainDepartments.find((d) => d.id === id);
    try {
      const response = await axios.put(`http://localhost:8080/api/mainDepartments/${id}`, {
        ...dept,
        status: !dept.status,
      });
      setMainDepartments(mainDepartments.map((d) => (d.id === id ? response.data : d)));
    } catch (error) {
      console.error("Error toggling status", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDepartments = Array.isArray(mainDepartments) ? mainDepartments.filter((dept) => 
    dept.mainDept && dept.mainDept.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl font-bold">Main Department Master</marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Department"
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full sm:w-auto"
            />
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Search"
          >
            <FaSearch />
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setShowSearch(false);
            }}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Reset"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-xl font-semibold">Add Main Department</h3>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col col-span-2">
            <label className="mb-1 font-medium">Main Department</label>
            <input
              type="text"
              placeholder="Main Department Name"
              value={formState.mainDept}
              onChange={(e) => setFormState({ ...formState, mainDept: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <button
              onClick={handleAddMainDepartment}
              className="bg-blue-500 text-white p-2 rounded w-32"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-4">Sr No</th>
            <th className="p-4">Main Department</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((dept, index) => (
            <tr key={dept.id} className="border-b">
              <td className="p-4">{index + 1}</td>
              <td className="p-4">{dept.mainDept}</td>
              <td className="p-4">
                <span className={`font-bold ${dept.status ? 'text-green-500' : 'text-red-500'}`}>
                  {dept.status ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-4 space-x-2">
                <button onClick={() => toggleStatus(dept.id)} className="text-blue-500">
                  {dept.status ? <FaCheck /> : <FaTimes />}
                </button>
                <button onClick={() => handleEdit(dept.id)} className="text-blue-500">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(dept.id)} className="text-blue-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainDepartmentMaster;
