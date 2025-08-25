import LegalLayout from '../../components/legal/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="August 25, 2025">
      <div className="space-y-8">
        {/* Table of Contents */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Table of Contents</h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li><a href="#acceptance" className="text-indigo-600 hover:text-indigo-800">Acceptance of Terms</a></li>
            <li><a href="#description" className="text-indigo-600 hover:text-indigo-800">Description of Service</a></li>
            <li><a href="#accounts" className="text-indigo-600 hover:text-indigo-800">User Accounts and Responsibilities</a></li>
            <li><a href="#privacy" className="text-indigo-600 hover:text-indigo-800">Privacy and Data Usage</a></li>
            <li><a href="#ai" className="text-indigo-600 hover:text-indigo-800">AI Features and Limitations</a></li>
            <li><a href="#acceptable" className="text-indigo-600 hover:text-indigo-800">Acceptable Use Policy</a></li>
            <li><a href="#payment" className="text-indigo-600 hover:text-indigo-800">Payment Terms</a></li>
            <li><a href="#intellectual" className="text-indigo-600 hover:text-indigo-800">Intellectual Property Rights</a></li>
            <li><a href="#thirdparty" className="text-indigo-600 hover:text-indigo-800">Third-Party Services</a></li>
            <li><a href="#availability" className="text-indigo-600 hover:text-indigo-800">Service Availability</a></li>
            <li><a href="#disclaimers" className="text-indigo-600 hover:text-indigo-800">Disclaimers</a></li>
            <li><a href="#limitation" className="text-indigo-600 hover:text-indigo-800">Limitation of Liability</a></li>
            <li><a href="#indemnification" className="text-indigo-600 hover:text-indigo-800">Indemnification</a></li>
            <li><a href="#termination" className="text-indigo-600 hover:text-indigo-800">Termination</a></li>
            <li><a href="#governing" className="text-indigo-600 hover:text-indigo-800">Governing Law</a></li>
            <li><a href="#severability" className="text-indigo-600 hover:text-indigo-800">Severability</a></li>
            <li><a href="#force" className="text-indigo-600 hover:text-indigo-800">Force Majeure</a></li>
            <li><a href="#changes" className="text-indigo-600 hover:text-indigo-800">Changes to Terms</a></li>
          </ol>
        </div>

        <div id="acceptance">
          <h3 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h3>
          <p>
            By accessing and using Dog Log Tracker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </div>

        <div id="description">
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

        <div id="accounts">
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

        <div id="privacy">
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

        <div id="ai">
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

        <div id="acceptable">
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

        <div id="payment">
          <h3 className="text-2xl font-bold mb-4">7. Payment Terms</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">Free Services</h4>
              <p>
                Many of our core features are provided free of charge. We reserve the right to introduce paid features or subscriptions in the future.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-2">Premium Features</h4>
              <p className="mb-3">If we introduce premium features, the following terms will apply:</p>
              <ul className="space-y-1 ml-4">
                <li>• All fees are non-refundable unless otherwise stated</li>
                <li>• Subscription fees are billed in advance</li>
                <li>• You may cancel your subscription at any time</li>
                <li>• Price changes will be communicated 30 days in advance</li>
              </ul>
            </div>
          </div>
        </div>

        <div id="intellectual">
          <h3 className="text-2xl font-bold mb-4">8. Intellectual Property Rights</h3>
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

        <div id="thirdparty">
          <h3 className="text-2xl font-bold mb-4">9. Third-Party Services</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">Integration Services</h4>
              <p>
                Our Service may integrate with third-party services including Google Authentication, AI providers (OpenAI, Groq), 
                and cloud storage services. Your use of these services is subject to their respective terms of service and privacy policies.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-2">Third-Party Links</h4>
              <p>
                Our Service may contain links to third-party websites or services. We are not responsible for the content, 
                privacy policies, or practices of third-party websites or services.
              </p>
            </div>
          </div>
        </div>

        <div id="availability">
          <h3 className="text-2xl font-bold mb-4">10. Service Availability</h3>
          <p>
            We strive to provide reliable service but cannot guarantee 100% uptime. The Service may be temporarily 
            unavailable for maintenance, updates, or due to technical issues. We will provide reasonable notice 
            for planned maintenance when possible.
          </p>
        </div>

        <div id="disclaimers">
          <h3 className="text-2xl font-bold mb-4">11. Disclaimers</h3>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
              <h4 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">🚨 Important Medical Disclaimer</h4>
              <p className="text-red-700 dark:text-red-300">
                Dog Log Tracker is <strong>NOT a medical device</strong> and does <strong>NOT provide medical advice</strong>. 
                All information and AI analysis are for informational purposes only and should not be considered as professional veterinary advice.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-2">Service Disclaimers</h4>
              <p className="mb-3">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, INCLUDING:</p>
              <ul className="space-y-1 ml-4">
                <li>• No warranty of uninterrupted or error-free operation</li>
                <li>• No warranty of accuracy or reliability of information</li>
                <li>• No warranty that the service will meet your specific needs</li>
                <li>• No warranty of compatibility with your devices or systems</li>
              </ul>
            </div>
          </div>
        </div>

        <div id="limitation">
          <h3 className="text-2xl font-bold mb-4">12. Limitation of Liability</h3>
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

        <div id="indemnification">
          <h3 className="text-2xl font-bold mb-4">13. Indemnification</h3>
          <p className="mb-4">
            You agree to defend, indemnify, and hold harmless Dog Log Tracker and its officers, directors, employees, 
            and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses 
            (including attorney's fees) arising from:
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Your use or misuse of the Service</li>
            <li>• Your violation of these Terms</li>
            <li>• Your violation of the rights of any third party</li>
            <li>• Any decisions you make regarding your pet's health based on our Service</li>
          </ul>
        </div>

        <div id="termination">
          <h3 className="text-2xl font-bold mb-4">14. Termination</h3>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice, 
            for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            You may also terminate your account at any time through your account settings.
          </p>
        </div>

        <div id="governing">
          <h3 className="text-2xl font-bold mb-4">15. Governing Law and Jurisdiction</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">Governing Law</h4>
              <p>
                These Terms shall be governed and construed in accordance with the laws of Israel, 
                without regard to its conflict of law provisions.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-2">Dispute Resolution</h4>
              <p className="mb-3">Any disputes arising from these Terms or your use of the Service will be resolved through:</p>
              <ol className="space-y-1 list-decimal list-inside ml-4">
                <li>Good faith negotiation between the parties</li>
                <li>If negotiation fails, binding arbitration under Israeli law</li>
                <li>Any court proceedings will be exclusively in Israeli courts</li>
              </ol>
            </div>
          </div>
        </div>

        <div id="severability">
          <h3 className="text-2xl font-bold mb-4">16. Severability</h3>
          <p>
            If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed 
            and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law 
            and the remaining provisions will continue in full force and effect.
          </p>
        </div>

        <div id="force">
          <h3 className="text-2xl font-bold mb-4">17. Force Majeure</h3>
          <p>
            We shall not be liable for any failure or delay in performance under these Terms which is due to causes beyond our reasonable control, 
            including but not limited to acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, 
            fire, floods, accidents, network infrastructure failures, strikes, or shortages of transportation facilities, fuel, energy, labor, or materials.
          </p>
        </div>

        <div id="changes">
          <h3 className="text-2xl font-bold mb-4">18. Changes to Terms</h3>
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