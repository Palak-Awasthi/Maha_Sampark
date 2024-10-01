import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa'; // Import icons

const BirthdayList = () => {
    const [birthdays, setBirthdays] = useState([]);

    useEffect(() => {
        const fetchBirthdays = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/mcs/birthdays");
                setBirthdays(response.data); // Set the names received from the API
            } catch (error) {
                console.error('Error fetching birthdays:', error);
            }
        };

        fetchBirthdays();
    }, []);

    // Function to handle Gmail wish
    const wishByGmail = (name) => {
        const email = "example@example.com"; // Replace with actual email or use a prompt to ask
        const subject = `Happy Birthday ${name}`;
        const body = `Happy Birthday ${name}! 🎉`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
    };

    // Function to handle WhatsApp wish
    const wishByWhatsApp = (name) => {
        const message = `Happy Birthday ${name}! 🎉`;
        const phoneNumber = '1234567890'; // Replace with actual phone number
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-400 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">Today's Birthday</h2>
            <ul className="space-y-4">
                {birthdays.length > 0 ? (
                    birthdays.map((name, index) => (
                        <li key={index} className='bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex justify-between items-center'>
                            <span>Happy Birthday {name}</span>
                            <div className="flex space-x-2">
                                <button onClick={() => wishByGmail(name)} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                                    <FaEnvelope />
                                </button>
                                <button onClick={() => wishByWhatsApp(name)} className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition duration-300">
                                    <FaWhatsapp />
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No birthdays today.</li>
                )}
            </ul>
        </div>
    );
};

export default BirthdayList;
