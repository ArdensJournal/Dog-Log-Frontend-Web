import LegalLayout from '../../components/legal/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="August 25, 2025">
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h3>
          <p>
            By accessing and using Dog Log Tracker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">2. Description of Service</h3>
          <p className="mb-4">
            Dog Log Tracker is a mobile and web application that helps dog owners track their pets' health, activities, and care routines. Our services include:
          </p>
          <ul className="space-y-2 ml-4">
            <li>• Dog profile management and information tracking</li>
            <li>• Health record keeping and monitoring</li>
            <li>• Activity and behavior logging</li>
            <li>• Vaccination and medical appointment reminders</li>
            <li>• AI-powered image and video analysis for health insights</li>
            <li>• Location-based services for walks and activities</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">3. User Accounts and Responsibilities</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">Account Registration</h4>
              <p>
                You must provide accurate, current, and complete information during registration and keep your account information updated.
                You are responsible for safeguarding your account credentials and all activities under your account.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-2">User Responsibilities</h4>
              <ul className="space-y-1 ml-4">
                <li>• Provide accurate information about your dogs</li>
                <li>• Use the Service in compliance with applicable laws</li>
                <li>• Not share your account with others</li>
                <li>• Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">4. Privacy and Data Usage</h3>
          <p className="mb-4">
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information 
            when you use our Service. By using our Service, you agree to the collection and use of information in 
            accordance with our Privacy Policy.
          </p>
          <p>
            <strong>Important:</strong> Dog health information you provide is sensitive data. We use this information 
            solely to provide our services and will never share it without your explicit consent, except as required by law.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">5. AI Features and Limitations</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">AI-Powered Analysis</h4>
              <p>
                Our Service includes AI features for image and video analysis. These features are provided for informational 
                purposes only and should not replace professional veterinary advice.
              </p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <h4 className="text-xl font-semibold mb-2 text-yellow-800 dark:text-yellow-200">⚠️ Medical Disclaimer</h4>
              <p className="text-yellow-700 dark:text-yellow-300">
                <strong>AI analysis results are not medical diagnoses.</strong> Always consult with a qualified veterinarian 
                for medical advice, diagnosis, or treatment. Do not delay seeking professional veterinary care based on AI analysis results.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">6. Acceptable Use Policy</h3>
          <p className="mb-4">You agree not to use the Service to:</p>
          <ul className="space-y-1 ml-4">
            <li>• Upload false, misleading, or inaccurate information</li>
            <li>• Violate any applicable laws or regulations</li>
            <li>• Interfere with or disrupt the Service or servers</li>
            <li>• Attempt to gain unauthorized access to other users' accounts</li>
            <li>• Use the Service for commercial purposes without authorization</li>
            <li>• Share inappropriate content or images</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">7. Intellectual Property Rights</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">Our Rights</h4>
              <p>
                The Service and its original content, features, and functionality are owned by Dog Log Tracker and are 
                protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-2">Your Content</h4>
              <p>
                You retain ownership of content you upload to the Service. By uploading content, you grant us a license 
                to use, store, and process your content to provide our services.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">8. Service Availability</h3>
          <p>
            We strive to provide reliable service but cannot guarantee 100% uptime. The Service may be temporarily 
            unavailable for maintenance, updates, or due to technical issues. We will provide reasonable notice 
            for planned maintenance when possible.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">9. Limitation of Liability</h3>
          <p className="mb-4">
            To the fullest extent permitted by law, Dog Log Tracker shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages, including without limitation, loss of profits, data, use, 
            goodwill, or other intangible losses.
          </p>
          <p>
            <strong>Pet Health Disclaimer:</strong> We are not responsible for any decisions you make regarding your 
            pet's health based on information or analysis provided by our Service.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">10. Termination</h3>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice, 
            for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            You may also terminate your account at any time through your account settings.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">11. Changes to Terms</h3>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, 
            we will provide at least 30 days notice prior to any new terms taking effect. 
            Continued use of the Service after changes constitutes acceptance of new Terms.
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p><strong>Dog Log Tracker</strong></p>
            <p>Email: <a href="mailto:logdogtracker+android@gmail.com" className="text-indigo-600 hover:text-indigo-800">logdogtracker+android@gmail.com</a></p>
            <p>Israel</p>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 border-t pt-4">
          <p>
            <strong>Effective Date:</strong> August 25, 2025<br/>
            <strong>Last Updated:</strong> August 25, 2025
          </p>
        </div>
      </div>
    </LegalLayout>
  );
}