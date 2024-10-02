import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const BirthdayList = () => {
    const [birthdays, setBirthdays] = useState([]);

    useEffect(() => {
        const fetchBirthdays = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/mcs/birthdays");
                setBirthdays(response.data); // Now this contains objects with name, email, and mobile number
            } catch (error) {
                console.error('Error fetching birthdays:', error);
            }
        };

        fetchBirthdays();
    }, []);

    const wishByGmail = (email, name) => {
        const subject = `Happy Birthday ${name}`;
        const body = `Happy Birthday ${name}! 🎉`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
    };

    const wishByWhatsApp = (mobileNumber, name) => {
        const message = `Happy Birthday ${name}! 🎉`;
        window.open(`https://wa.me/${mobileNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-400 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">Today's Birthday</h2>
            <ul className="space-y-4">
                {birthdays.length > 0 ? (
                    birthdays.map((birthday, index) => (
                        <li key={index} className='bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex justify-between items-center'>
                            <span>Happy Birthday {birthday.name}</span>
                            <div className="flex space-x-2">
                                <button onClick={() => wishByGmail(birthday.email, birthday.name)} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                                    <FaEnvelope />
                                </button>
                                <button onClick={() => wishByWhatsApp(birthday.mobileNumber, birthday.name)} className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition duration-300">
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
