import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './Header'; 
import Footer from './Footer'; 
import { Player } from '@lottiefiles/react-lottie-player';

function OtpLogin() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin
  const navigate = useNavigate();

  // Sample list of admin mobile numbers
  const adminMobileNumbers = ['1234567890', '0987654321']; // Replace with actual admin numbers

  const sendOtp = (e) => {
    e.preventDefault();
    
    // Check if the entered mobile number is an admin
    if (adminMobileNumbers.includes(mobileNumber)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    
    console.log('OTP sent to:', mobileNumber);
    setOtpSent(true);
  };

  const handleOtpChange = (element, index) => {
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Automatically move to the next input field
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    console.log('OTP entered:', otpCode);

    // OTP verification logic (replace with actual verification)
    if (otpCode === '123456') { // Simulating successful OTP verification
      console.log('OTP verified successfully!');

      // Redirect based on user role
      if (isAdmin) {
        navigate('/admindashboard'); // Redirect to AdminDashboard for admins
      } else {
        navigate('/dashboard'); // Redirect to UserDashboard for regular users
      }
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleRegister = () => {
    navigate('/register'); // Navigate to the registration page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-1 flex-col lg:flex-row justify-center items-center p-6">
        {/* Left Section - Lottie Animation */}
        <div className="flex-1 hidden lg:flex justify-center items-center p-6">
          <Player
            autoplay
            loop
            src="https://lottie.host/c4726432-40cc-4db6-ba9c-5fd055159615/wvQteuXNvE.json"
            style={{ height: '300px', width: '300px' }}
          />
        </div>

        {/* Right Section - Login Form */}
        <div className="flex-1 bg-blue-50 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Login
          </h2>
          {!otpSent ? (
            <form onSubmit={sendOtp}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your mobile number"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Enter OTP
                </label>
                <div className="flex space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              >
                Verify OTP
              </button>
            </form>
          )}
          {/* Registration Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleRegister}
              className="text-blue-500 hover:underline"
            >
              Register here
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default OtpLogin;
