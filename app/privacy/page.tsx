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
            <li><a href="#cookies" className="text-indigo-600 hover:text-indigo-800">Cookies and Tracking Technologies</a></li>
            <li><a href="#ai" className="text-indigo-600 hover:text-indigo-800">Artificial Intelligence Features</a></li>
            <li><a href="#sociallogins" className="text-indigo-600 hover:text-indigo-800">How Do We Handle Social Logins?</a></li>
            <li><a href="#inforetain" className="text-indigo-600 hover:text-indigo-800">How Long Do We Keep Your Information?</a></li>
            <li><a href="#infosafe" className="text-indigo-600 hover:text-indigo-800">How Do We Keep Your Information Safe?</a></li>
            <li><a href="#privacyrights" className="text-indigo-600 hover:text-indigo-800">What Are Your Privacy Rights?</a></li>
            <li><a href="#policyupdates" className="text-indigo-600 hover:text-indigo-800">Do We Make Updates to This Notice?</a></li>
            <li><a href="#controls" className="text-indigo-600 hover:text-indigo-800">Controls for Do-Not-Track Features</a></li>
            <li><a href="#residents" className="text-indigo-600 hover:text-indigo-800">Do California Residents Have Specific Privacy Rights?</a></li>
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

        <div id="legalbases">
          <h3 className="text-2xl font-bold mb-4">3. What Legal Bases Do We Rely On to Process Your Personal Information?</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> We only process your personal information when we believe it is necessary and we have a valid legal reason (legal basis) to do so under applicable law.</p>
          
          <p className="mb-4">If you are located in the EU or UK, this section applies to you. The legal bases we rely on to process your personal information include:</p>
          <ul className="space-y-2 ml-4">
            <li>• <strong>Consent:</strong> We may process your information if you have given us permission (consent) to use your personal information for specific purposes.</li>
            <li>• <strong>Performance of a Contract:</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you.</li>
            <li>• <strong>Legitimate Interests:</strong> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests.</li>
          </ul>
          
          <p className="mt-4">If you are located outside the EU and UK, this section may still apply to you if you use our Services from within the EU or UK.</p>
        </div>

        <div id="whoshare">
          <h3 className="text-2xl font-bold mb-4">4. When and With Whom Do We Share Your Personal Information?</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> We may share information in specific situations described in this section and/or with third-party service providers.</p>
          
          <p className="mb-4">We may need to share your personal information in the following situations:</p>
          <ul className="space-y-2 ml-4">
            <li>• <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
            <li>• <strong>When we use Google Analytics:</strong> We may share your information with Google Analytics to track and analyze the use of the Services.</li>
            <li>• <strong>Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
            <li>• <strong>Business Partners:</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
            <li>• <strong>With your consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
          </ul>
        </div>

        <div id="cookies">
          <h3 className="text-2xl font-bold mb-4">5. Cookies and Tracking Technologies</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> We may use cookies and similar tracking technologies to collect and store information.</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">What We Use</h4>
              <p className="mb-3">We may use the following technologies:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Cookies:</strong> Small data files stored on your device for authentication and preferences</li>
                <li>• <strong>Local Storage:</strong> Browser storage for application data and user preferences</li>
                <li>• <strong>Session Storage:</strong> Temporary storage for session-specific information</li>
                <li>• <strong>Analytics Tools:</strong> Third-party tools to understand app usage and performance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-2">Your Choices</h4>
              <p>
                You can manage cookies through your browser settings. However, disabling certain cookies may affect 
                the functionality of our Service, particularly authentication and user preferences.
              </p>
            </div>
          </div>
        </div>

        <div id="ai">
          <h3 className="text-2xl font-bold mb-4">6. Artificial Intelligence Features</h3>
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
          <h3 className="text-2xl font-bold mb-4">7. How Do We Handle Social Logins?</h3>
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

        <div id="inforetain">
          <h3 className="text-2xl font-bold mb-4">8. How Long Do We Keep Your Information?</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless otherwise required by law.</p>
          
          <p className="mb-4">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Policy, 
            unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
          </p>
          
          <p className="mb-4">
            When we have no ongoing legitimate business need to process your personal information, we will either delete or 
            anonymize such information, or, if this is not possible (for example, because your personal information has been 
            stored in backup archives), then we will securely store your personal information and isolate it from any further 
            processing until deletion is possible.
          </p>
          
          <div className="mt-6">
            <h4 className="text-xl font-semibold mb-3">Account Deletion</h4>
            <p className="mb-3">
              If you wish to cancel your account or request that we no longer use your information to provide you services, 
              you may delete your account by contacting us at logdogtracker+android@gmail.com.
            </p>
          </div>
        </div>

        <div id="infosafe">
          <h3 className="text-2xl font-bold mb-4">9. How Do We Keep Your Information Safe?</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> We aim to protect your personal information through a system of organizational and technical security measures.</p>
          
          <p className="mb-4">
            We have implemented appropriate and reasonable technical and organizational security measures designed to protect 
            the security of any personal information we process. However, despite our safeguards and efforts to secure your 
            information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 
            100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties 
            will not be able to defeat our security and improperly collect, access, steal, or modify your information.
          </p>
          
          <p className="mb-4">Security measures we implement include:</p>
          <ul className="space-y-2 ml-4">
            <li>• Encryption of data in transit and at rest</li>
            <li>• Regular security assessments and updates</li>
            <li>• Access controls and authentication measures</li>
            <li>• Secure hosting infrastructure</li>
            <li>• Regular backup and recovery procedures</li>
          </ul>
          
          <p className="mt-4">
            Although we will do our best to protect your personal information, transmission of personal information to and from 
            our Services is at your own risk. You should only access the Services within a secure environment.
          </p>
        </div>

        <div id="privacyrights">
          <h3 className="text-2xl font-bold mb-4">10. What Are Your Privacy Rights?</h3>
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

        <div id="policyupdates">
          <h3 className="text-2xl font-bold mb-4">11. Do We Make Updates to This Notice?</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>
          
          <p className="mb-4">
            We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" 
            date and the updated version will be effective as soon as it is accessible.
          </p>
          
          <p className="mb-4">
            If we make material changes to this Privacy Policy, we may notify you either by prominently posting a notice of 
            such changes or by directly sending you a notification. We encourage you to review this Privacy Policy frequently 
            to be informed of how we are protecting your information.
          </p>
        </div>

        <div id="controls">
          <h3 className="text-2xl font-bold mb-4">12. Controls for Do-Not-Track Features</h3>
          <p className="mb-4">
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature 
            or setting you can activate to signal your privacy preference not to have data about your online browsing activities 
            monitored and collected.
          </p>
          
          <p className="mb-4">
            At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. 
            As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates 
            your choice not to be tracked online.
          </p>
        </div>

        <div id="residents">
          <h3 className="text-2xl font-bold mb-4">13. Do California Residents Have Specific Privacy Rights?</h3>
          <p className="mb-4"><strong><em>In Short:</em></strong> Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.</p>
          
          <p className="mb-4">
            California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California 
            residents to request and obtain from us, once a year and free of charge, information about categories of personal 
            information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all 
            third parties with which we shared personal information in the immediately preceding calendar year.
          </p>
          
          <p className="mb-4">
            If you are under 18 years of age, reside in California, and have a registered account with Services, you have the 
            right to request removal of unwanted data that you publicly post on the Services.
          </p>
          
          <p className="mb-4">
            If you would like to make such a request, please contact us using the contact information provided below and include 
            the email address associated with your account.
          </p>
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