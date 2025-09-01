'use client';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🛠️</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Services
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover professional services and tools to help you take better care of your dog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Veterinary Services */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
              <div className="text-3xl mb-3">🏥</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Veterinary Care</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Find qualified veterinarians in your area</p>
              <button className="text-green-600 dark:text-green-400 font-medium text-sm hover:underline">
                Find Vets Near Me
              </button>
            </div>

            {/* Pet Grooming */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-700">
              <div className="text-3xl mb-3">✂️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Pet Grooming</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Professional grooming services</p>
              <button className="text-pink-600 dark:text-pink-400 font-medium text-sm hover:underline">
                Book Grooming
              </button>
            </div>

            {/* Training */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Dog Training</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Professional dog training services</p>
              <button className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline">
                Find Trainers
              </button>
            </div>

            {/* Pet Sitting */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Pet Sitting</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Trusted pet sitters when you're away</p>
              <button className="text-orange-600 dark:text-orange-400 font-medium text-sm hover:underline">
                Find Pet Sitters
              </button>
            </div>

            {/* Emergency Services */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
              <div className="text-3xl mb-3">🚨</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Emergency Care</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">24/7 emergency veterinary services</p>
              <button className="text-red-600 dark:text-red-400 font-medium text-sm hover:underline">
                Emergency Contacts
              </button>
            </div>

            {/* Insurance */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Pet Insurance</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Protect your pet with insurance</p>
              <button className="text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline">
                Compare Plans
              </button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Coming Soon</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We're working on expanding our services directory. Soon you'll be able to book appointments, 
              read reviews, and manage all your dog's service needs right from the app!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
