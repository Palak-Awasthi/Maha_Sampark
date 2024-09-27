import React, { useState, useEffect } from "react";
import axios from "axios";
import AddContactModal from "./AddContactModal"; // Adjust the import as needed

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts(); // Fetch contacts on component mount
  }, []);

  return (
    <div>
      <h1>Contact List</h1>
      <button onClick={() => setModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Contact
      </button>

      {/* Render the contacts list here */}
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.district} - {contact.officeName}
          </li>
        ))}
      </ul>

      <AddContactModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        fetchContacts={fetchContacts} 
      />
    </div>
  );
};

export default ContactsList;
