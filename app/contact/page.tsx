"use client";

import { useState } from 'react';
import axios from 'axios';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (!formData.name || !formData.number || !formData.message) {
      setSubmitStatus('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('');
    const payload= {
          name: formData.name,
          number: formData.number,
          message: formData.message,
          timestamp: new Date().toISOString()
        }
    try {
      const backend_url = import.meta.env.VITE_BACKEND_URL
      const response = await axios.post(`${backend_url}/contact-us`, payload,{
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response) {
        setSubmitStatus('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', number: '', message: '' });
        
        // Optional: Show success for 5 seconds then clear
        setTimeout(() => setSubmitStatus(''), 5000);
      } else {
        setSubmitStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('Error sending message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              We're here for you
            </h1>
            <p className="text-gray-600 mb-8">
              Our friendly team is always here to chat.
            </p>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your number <span className="text-red-500">*</span>
                </label>
                <input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100"
                />
              </div>

              {submitStatus && (
                <div className={`p-4 rounded-md ${
                  submitStatus.includes('successfully') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : submitStatus.includes('Error') || submitStatus.includes('Failed')
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                }`}>
                  {submitStatus}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Store Location & Setup Instructions */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Store Location
              </h2>
              <p className="text-gray-700 leading-relaxed">
                3/183 NAVAMARATHUPATTI, SULLERUMBU POST, DINDIGUL, Tamilnadu 624710.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}