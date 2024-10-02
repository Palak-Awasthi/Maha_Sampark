import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from './Header'; 
import Footer from './Footer'; 

const RegistrationForm = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        profession: '',
        photo: null,
        govtId: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });

        validateField(name, files ? files[0] : value);
    };

    const validateField = (name, value) => {
        let formErrors = { ...errors };

        switch (name) {
            case 'name':
                formErrors.name = value.trim() ? '' : 'Name is required';
                break;
            case 'phoneNumber':
                const phonePattern = /^[0-9]{10}$/;
                formErrors.phoneNumber = phonePattern.test(value) ? '' : 'Phone number must be 10 digits';
                break;
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                formErrors.email = emailPattern.test(value) ? '' : 'Invalid email address';
                break;
            case 'profession':
                formErrors.profession = value.trim() ? '' : 'Profession is required';
                break;
            case 'photo':
                formErrors.photo = value ? '' : 'Photo is required';
                break;
            case 'govtId':
                formErrors.govtId = value.trim() ? '' : 'Government ID is required';
                break;
            default:
                break;
        }

        setErrors(formErrors);
    };

    const validateForm = () => {
        const formErrors = {};
        let isValid = true;

        Object.keys(formData).forEach((key) => {
            validateField(key, formData[key]);
            if (errors[key]) {
                isValid = false;
            }
        });

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const form = new FormData();
        const currentDateTime = new Date();
        const formattedDate = `${currentDateTime.getTime()}_${currentDateTime.toLocaleDateString().replace(/\//g, '-')}`;
        const photoFileName = `Image_${formattedDate}.png`;

        form.append('name', formData.name);
        form.append('phoneNumber', formData.phoneNumber);
        form.append('email', formData.email);
        form.append('profession', formData.profession);
        form.append('photo', formData.photo, photoFileName);
        form.append('govtId', formData.govtId);

        try {
            const response = await fetch('http://localhost:8080/api/registrations/register', {
                method: 'POST',
                body: form,
            });

            if (response.ok) {
                const responseData = await response.json();
                Swal.fire({
                    title: 'Success!',
                    text: `Registration successful. Unique ID: ${responseData.uniqueId}`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/'); // Redirect to OtpLogin page
                    }
                });
                setFormData({
                    name: '',
                    phoneNumber: '',
                    email: '',
                    profession: '',
                    photo: null,
                    govtId: ''
                });
            } else {
                const errorMessage = await response.text();
                Swal.fire('Error!', `Registration failed: ${errorMessage}`, 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Error while registering user', 'error');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />  {/* Ensure header is always at the top */}
            <div className="flex-grow flex justify-center items-center bg-gradient-to-br from-blue-400 to-blue-100 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-5xl bg-white p-8 shadow-xl rounded-lg"> {/* Form container */}
                    <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Registration Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Input fields */}
                            <div className="relative">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your name"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your phone number"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your email"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700">Profession</label>
                                <input
                                    type="text"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.profession ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your profession"
                                />
                                {errors.profession && <p className="text-red-500 text-sm mt-1">{errors.profession}</p>}
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700">Photo</label>
                                <input
                                    type="file"
                                    name="photo"
                                    accept=".png, .jpg, .jpeg"
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.photo ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700">Government ID</label>
                                <input
                                    type="text"
                                    name="govtId"
                                    value={formData.govtId}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.govtId ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your government ID"
                                />
                                {errors.govtId && <p className="text-red-500 text-sm mt-1">{errors.govtId}</p>}
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full sm:w-auto py-3 px-6 text-white bg-blue-500 rounded-md font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />  {/* Ensure footer is always at the bottom */}
        </div>
    );
};

export default RegistrationForm;
