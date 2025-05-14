import React from 'react';
import { Link } from 'react-router-dom';
import SupabaseHeader from './landing/SupabaseHeader';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SupabaseHeader />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose prose-indigo max-w-none">
            <p className="text-gray-600 mb-4">Last Updated: May 14, 2025</p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Introduction</h2>
            <p>
              Welcome to Lasoo. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 mt-2 mb-4">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address, telephone numbers, and postal address.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, products, and services.</li>
              <li><strong>Location Data</strong> includes your current location when you consent to share it and your company's postcode.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 mt-2 mb-4">
              <li>To register you as a new customer or service provider.</li>
              <li>To provide our services, including connecting users with service providers.</li>
              <li>To manage our relationship with you.</li>
              <li>To improve our website, products/services, marketing, or customer relationships.</li>
              <li>To recommend services that may be of interest to you.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Service Provider Location Information</h2>
            <p>
              For service providers, we collect and process location information in two ways:
            </p>
            <ul className="list-disc pl-5 mt-2 mb-4">
              <li><strong>Headquarters Location</strong>: Based on your company's postcode, used to determine service area coverage.</li>
              <li><strong>Current Location</strong>: When you choose to share it, used to show your real-time location to potential customers.</li>
            </ul>
            <p>
              You can opt out of sharing your current location at any time through your dashboard settings.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
              including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-5 mt-2 mb-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our website and hold certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Changes to This Privacy Policy</h2>
            <p>
              We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page 
              and updating the "Last Updated" date at the top of this privacy policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p>Email: privacy@lasoo.com</p>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
