'use client';

import Link from 'next/link';

export default function ForumMockupPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-8">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2 text-center drop-shadow-lg">🐾 Dog Log Forum (Vision Mockup)</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
          The ultimate community for dog lovers—connect, learn, share, and celebrate your pups!
        </p>

        {/* Forum Categories */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Forum Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">Breed-Specific Communities</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Labrador, German Shepherd, Golden Retriever, and more</li>
                <li>Breed-specific health, training, and stories</li>
              </ul>
              <span className="inline-block bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-xs">Subforums</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">Training & Behavior</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Obedience, housebreaking, advanced tricks</li>
                <li>Positive reinforcement & behavior advice</li>
              </ul>
              <span className="inline-block bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">Tips & Q&A</span>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-300 mb-2">Health & Wellness</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Illnesses, vet recommendations, nutrition</li>
                <li>Holistic remedies & preventive care</li>
              </ul>
              <span className="inline-block bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs">Ask a Vet</span>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-pink-700 dark:text-pink-300 mb-2">Dog-Friendly Places</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Dog parks, cafes, vacation spots</li>
                <li>Maps & reviews of local establishments</li>
              </ul>
              <span className="inline-block bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 px-2 py-1 rounded text-xs">Local Guides</span>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">Rescue & Adoption</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Rescue stories & adoption experiences</li>
                <li>Resources for shelters & fosters</li>
              </ul>
              <span className="inline-block bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs">Support</span>
            </div>
          </div>
        </section>

        {/* Interactive Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Interactive Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">Photo & Video Sharing</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Share your dog's best moments</li>
                <li>Themed challenges: "Best Trick", "Cutest Pup"</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-purple-700 dark:text-purple-300 mb-2">Q&A Section</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Ask questions, get advice from owners & pros</li>
                <li>Voting system for helpful answers</li>
              </ul>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900/40 rounded-xl p-6 shadow">
              <h3 className="font-bold text-pink-700 dark:text-pink-300 mb-2">Dog of the Month Contest</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Nominate & vote for favorite dog photos</li>
                <li>Win fun prizes & badges</li>
              </ul>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-xl p-6 shadow">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-300 mb-2">Polls & Surveys</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Favorite treats, walking routines, and more</li>
                <li>See what the community thinks</li>
              </ul>
            </div>
            <div className="bg-green-100 dark:bg-green-900/40 rounded-xl p-6 shadow">
              <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">Live Events</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Virtual meetups, webinars, live Q&A with vets</li>
                <li>Community dog walks & fundraisers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Community Engagement */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Community Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-xl p-6 shadow">
              <h3 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">User & Dog Profiles</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Profiles for owners and their dogs</li>
                <li>Photos, breed, age, and fun facts</li>
              </ul>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-300 mb-2">Achievements & Badges</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Earn badges for milestones and contributions</li>
                <li>Top Contributor, First Post, and more</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">Local Groups</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Regional forums for local connections</li>
                <li>Promote events, walks, and meetups</li>
              </ul>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-pink-700 dark:text-pink-300 mb-2">Story Sharing</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Share heartwarming or funny dog stories</li>
                <li>Read and comment on others' experiences</li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">Pet Marketplace</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Buy/sell toys, accessories, or services</li>
                <li>Find local groomers, walkers, and more</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Educational Content */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Educational Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">Expert Articles</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Written by vets, trainers, and nutritionists</li>
                <li>Dog psychology, diet plans, training tips</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">DIY Projects</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Homemade toys, beds, and treats</li>
                <li>Step-by-step guides and videos</li>
              </ul>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-300 mb-2">Puppy Care Tips</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Teething, crate training, socialization</li>
                <li>Advice for new dog owners</li>
              </ul>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-pink-700 dark:text-pink-300 mb-2">Senior Dog Care</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Mobility aids, dietary changes, comfort tips</li>
                <li>Resources for older dogs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Technical Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">Mobile App Integration</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Dedicated app for iOS & Android</li>
                <li>Push notifications for replies & updates</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">Gamification</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Points for posting, commenting, and helping</li>
                <li>Leaderboards and rewards</li>
              </ul>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-300 mb-2">Advanced Search Filters</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Search by breed, location, or keywords</li>
                <li>Find exactly what you need</li>
              </ul>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-pink-700 dark:text-pink-300 mb-2">Multimedia Support</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Easy upload of videos, GIFs, and images</li>
                <li>Rich media posts and comments</li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">Accessibility</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Text-to-speech, high-contrast, and more</li>
                <li>Inclusive for all users</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Monetization */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Monetization Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-xl p-6 shadow">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-300 mb-2">Sponsored Content</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Collaborate with pet brands for giveaways</li>
                <li>Sponsored posts and product reviews</li>
              </ul>
            </div>
            <div className="bg-green-100 dark:bg-green-900/40 rounded-xl p-6 shadow">
              <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">Premium Memberships</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Exclusive webinars, ad-free browsing</li>
                <li>Advanced features for members</li>
              </ul>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-xl p-6 shadow">
              <h3 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">Affiliate Marketing</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Recommended products with affiliate links</li>
                <li>Earn commissions for the community</li>
              </ul>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900/40 rounded-xl p-6 shadow">
              <h3 className="font-bold text-pink-700 dark:text-pink-300 mb-2">Merchandise Store</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Branded mugs, t-shirts, and dog accessories</li>
                <li>Support the forum and show your pride</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Community Rules */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Community Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-red-700 dark:text-red-300 mb-2">Safe Space</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>No bullying, negativity, or spam</li>
                <li>Respectful and welcoming for all</li>
              </ul>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">Moderation Team</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Active moderators for helpful, safe discussions</li>
                <li>Report inappropriate content easily</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 shadow">
              <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">Verified Experts</h3>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 mb-2">
                <li>Vets, trainers, and pros with verified badges</li>
                <li>Trustworthy advice and answers</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-lg">
          <em>
            This is a vision mockup. <br />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Forum features coming soon!</span>
          </em>
        </div>
      </div>
    </main>
  );
}