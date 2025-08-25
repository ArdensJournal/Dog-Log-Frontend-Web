import LegalLayout from '../../components/legal/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="August 25, 2025">
      {/* Privacy Notice Content */}
      <div className="space-y-8">
        <div>
          <p className="text-lg mb-4">
            This Privacy Policy for <strong>Dog Log Tracker</strong> ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>") 
            describes how and why we might access, collect, store, use, and/or share your personal information when you use our services.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">Summary of Key Points</h3>
          <p className="mb-4">
            <em>This summary provides key points from our Privacy Policy, but you can find out more details about any of these topics by reading the full policy below.</em>
          </p>
          
          <div className="space-y-4">
            <div>
              <strong>What personal information do we process?</strong>
              <p>When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
            </div>
            
            <div>
              <strong>Do we process any sensitive personal information?</strong>
              <p>We may process sensitive personal information related to your dogs' health data and breed information when necessary with your consent or as otherwise permitted by applicable law.</p>
            </div>
            
            <div>
              <strong>Do we collect any information from third parties?</strong>
              <p>We do not collect any information from third parties.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">Table of Contents</h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li><a href="#infocollect" className="text-indigo-600 hover:text-indigo-800">What Information Do We Collect?</a></li>
            <li><a href="#infouse" className="text-indigo-600 hover:text-indigo-800">How Do We Process Your Information?</a></li>
            <li><a href="#legalbases" className="text-indigo-600 hover:text-indigo-800">What Legal Bases Do We Rely On?</a></li>
            <li><a href="#whoshare" className="text-indigo-600 hover:text-indigo-800">When Do We Share Your Information?</a></li>
            <li><a href="#sociallogins" className="text-indigo-600 hover:text-indigo-800">How Do We Handle Social Logins?</a></li>
            <li><a href="#inforetain" className="text-indigo-600 hover:text-indigo-800">How Long Do We Keep Your Information?</a></li>
            <li><a href="#infosafe" className="text-indigo-600 hover:text-indigo-800">How Do We Keep Your Information Safe?</a></li>
            <li><a href="#privacyrights" className="text-indigo-600 hover:text-indigo-800">What Are Your Privacy Rights?</a></li>
          </ol>
        </div>

        <div id="infocollect">
          <h3 className="text-2xl font-bold mb-4">1. What Information Do We Collect?</h3>
          
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3">Personal Information You Disclose to Us</h4>
            <p className="mb-3"><strong><em>In Short:</em></strong> We collect personal information that you provide to us.</p>
            
            <p className="mb-3">The personal information we collect may include:</p>
            <ul className="space-y-1 ml-4">
              <li>• Names</li>
              <li>• Email addresses</li>
              <li>• Phone numbers</li>
              <li>• User accounts and profiles</li>
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3">Sensitive Information</h4>
            <p className="mb-3">When necessary, with your consent, we process the following categories of sensitive information:</p>
            <ul className="space-y-1 ml-4">
              <li>• Dog health data</li>
              <li>• Dog breed information</li>
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3">Application Data</h4>
            <p className="mb-3">If you use our application, we may collect:</p>
            <ul className="space-y-1 ml-4">
              <li>• <em>Geolocation Information:</em> We may request location access for location-based services</li>
              <li>• <em>Mobile Device Access:</em> We may request access to device features like camera, storage, and notifications</li>
              <li>• <em>Push Notifications:</em> We may send notifications regarding your account and app features</li>
            </ul>
          </div>
        </div>

        <div id="infouse">
          <h3 className="text-2xl font-bold mb-4">2. How Do We Process Your Information?</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</p>
          
          <p className="mb-3">We process your personal information for a variety of reasons, including:</p>
          <ul className="space-y-2 ml-4">
            <li>• <strong>To facilitate account creation and authentication</strong> and manage user accounts</li>
            <li>• <strong>To provide and maintain our Services</strong> including dog tracking and health monitoring</li>
            <li>• <strong>To send administrative information</strong> such as updates about our terms and policies</li>
            <li>• <strong>To request feedback</strong> and contact you about your use of our Services</li>
            <li>• <strong>To protect our Services</strong> including fraud monitoring and prevention</li>
          </ul>
        </div>

        <div id="ai">
          <h3 className="text-2xl font-bold mb-4">3. Artificial Intelligence Features</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> We offer AI-powered features for enhanced dog care.</p>
          
          <p className="mb-4">
            As part of our Services, we offer AI-powered features through third-party providers including Groq and OpenAI. 
            These tools are designed to enhance your dog care experience through:
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Video analysis for behavior monitoring</li>
            <li>• Image analysis for health assessment</li>
          </ul>
          
          <p className="mt-4">
            All personal information processed using our AI features is handled in line with our Privacy Policy 
            and ensures high security throughout the process.
          </p>
        </div>

        <div id="sociallogins">
          <h3 className="text-2xl font-bold mb-4">4. How Do We Handle Social Logins?</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> If you choose to register or log in using a social media account, we may have access to certain information about you.</p>
          
          <p className="mb-4">
            Our Services offer you the ability to register and log in using your Google account. When you choose to do this, 
            we will receive certain profile information including your name, email address, and profile picture.
          </p>
          
          <p>
            We will use this information only for the purposes described in this Privacy Policy. We recommend that you 
            review Google's privacy policy to understand how they collect, use, and share your personal information.
          </p>
        </div>

        <div id="privacyrights">
          <h3 className="text-2xl font-bold mb-4">5. What Are Your Privacy Rights?</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> Depending on your location, you have rights that allow you greater access to and control over your personal information.</p>
          
          <p className="mb-4">In some regions, you have certain rights under applicable data protection laws, including:</p>
          <ul className="space-y-2 ml-4">
            <li>• The right to request access to and obtain a copy of your personal information</li>
            <li>• The right to request rectification or erasure of your information</li>
            <li>• The right to restrict the processing of your personal information</li>
            <li>• The right to data portability</li>
            <li>• The right to object to the processing of your personal information</li>
          </ul>
          
          <div className="mt-6">
            <h4 className="text-xl font-semibold mb-3">Account Information</h4>
            <p className="mb-3">You can review or change the information in your account at any time by:</p>
            <ul className="space-y-1 ml-4">
              <li>• Logging into your account settings and updating your user account</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
          <p className="mb-4">
            If you have questions or comments about this Privacy Policy, you may email us at:
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p><strong>Dog Log Tracker</strong></p>
            <p>Email: <a href="mailto:logdogtracker+android@gmail.com" className="text-indigo-600 hover:text-indigo-800">logdogtracker+android@gmail.com</a></p>
            <p>Israel</p>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}