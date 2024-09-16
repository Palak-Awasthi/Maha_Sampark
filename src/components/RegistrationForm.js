import React, { useState } from 'react';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        profession: '',
        photo: null,
        govtId: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value // Handle file input
        });
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            formErrors.name = 'Name is required';
            isValid = false;
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!formData.phoneNumber.match(phonePattern)) {
            formErrors.phoneNumber = 'Phone number must be 10 digits';
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.match(emailPattern)) {
            formErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (!formData.profession.trim()) {
            formErrors.profession = 'Profession is required';
            isValid = false;
        }

        if (!formData.photo) {
            formErrors.photo = 'Photo is required';
            isValid = false;
        }

        if (!formData.govtId.trim()) {
            formErrors.govtId = 'Government ID is required';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        // Creating a FormData object to send form data as multipart/form-data
        const form = new FormData();
        const currentDateTime = new Date();
        const formattedDate = `${currentDateTime.getTime()}_${currentDateTime.toLocaleDateString().replace(/\//g, '-')}`;
        const photoFileName = `Image_${formattedDate}.png`; // Naming the file

        // Append form data
        form.append('name', formData.name);
        form.append('phoneNumber', formData.phoneNumber);
        form.append('email', formData.email);
        form.append('profession', formData.profession);
        form.append('photo', formData.photo, photoFileName); // Attach file with the correct name
        form.append('govtId', formData.govtId);

        try {
            const response = await fetch('http://localhost:8080/api/registrations/register', {
                method: 'POST',
                body: form,
            });

            if (response.ok) {
                const responseData = await response.json();
                alert(`Registration successful. Unique ID: ${responseData.uniqueId}`);
            } else {
                const errorMessage = await response.text();
                console.error('Registration failed:', errorMessage);
                alert(`Registration failed: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            alert('Error while registering user');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">Profession</label>
                    <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.profession && <p className="text-red-500 text-sm">{errors.profession}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">Photo</label>
                    <input
                        type="file"
                        name="photo"
                        accept=".png, .jpg, .jpeg"
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">Government ID</label>
                    <input
                        type="text"
                        name="govtId"
                        value={formData.govtId}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.govtId && <p className="text-red-500 text-sm">{errors.govtId}</p>}
                </div>
                <button type="submit" className="w-full bg-black-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;