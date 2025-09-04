'use client';

import React, { useState } from 'react';
import { MdExpandMore, MdExpandLess, MdPets, MdVaccines, MdMap, MdGroup, MdSecurity, MdSmartphone } from 'react-icons/md';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactElement;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: 'getting-started-1',
    question: 'What is Dog Log and what can it do for me?',
    answer: 'Dog Log is a comprehensive support tool for raising a dog (and later a cat). It helps you track your dog\'s weight, bathroom habits, and medication intake; provides reminders for medications and walks; suggests daily exercise time based on your dog\'s breed; and offers training modules. Future features will include dog park locations, veterinary tips, service provider locations, and the ability to share your dog\'s profile with family members.',
    category: 'Getting Started',
    icon: <MdPets className="w-5 h-5" />
  },
  {
    id: 'getting-started-2',
    question: 'How do I sign up for Dog Log?',
    answer: 'You can create a Dog Log account using several methods: manual registration with email and password, or sign in with your Google, Apple, or Meta (Facebook) account for quick access.',
    category: 'Getting Started',
    icon: <MdSmartphone className="w-5 h-5" />
  },
  {
    id: 'getting-started-3',
    question: 'How do I add my first dog?',
    answer: 'After creating your account, the first step is adding a dog through the add-dog process. You\'ll enter your dog\'s breed, which enables the app to provide tailored information like daily exercise duration, number of walks, and health tips. You can search for the breed by text or use the camera feature (Premium) to photograph your dog for breed identification.',
    category: 'Getting Started',
    icon: <MdPets className="w-5 h-5" />
  },

  // Dog Management
  {
    id: 'dog-management-1',
    question: 'Can I share my dog\'s profile with family members?',
    answer: 'Yes! Each Dog Log user can add up to five additional users to track a specific dog. There are two access levels: Editors (partners, parents, trusted individuals) can modify dog details like weight, breed, and age; Viewers (children, less trusted individuals) can only declare walks but cannot edit information.',
    category: 'Dog Management',
    icon: <MdGroup className="w-5 h-5" />
  },
  {
    id: 'dog-management-2',
    question: 'What happens if I delete my dog\'s profile?',
    answer: 'Only the dog owner can delete a dog profile. When deleted, all editor and viewer access is immediately revoked, and a timer (several days) begins allowing you to reverse the deletion. If restored, all previous users automatically regain access. After the timer ends, deletion becomes permanent and you cannot access any previous information.',
    category: 'Dog Management',
    icon: <MdSecurity className="w-5 h-5" />
  },
  {
    id: 'dog-management-3',
    question: 'How does breed-based tracking work?',
    answer: 'When you specify your dog\'s breed during setup, the system tailors information specifically for your dog, including average food quantity, number of daily outings, daily exercise time, and breed-specific tips. For mixed breeds, you can enter the mix for more accurate patterns. The system also supports camera-based breed identification (Premium feature).',
    category: 'Dog Management',
    icon: <MdPets className="w-5 h-5" />
  },

  // Health & Medical
  {
    id: 'health-1',
    question: 'How do I track vaccinations and medications?',
    answer: 'When entering a medication or vaccine, type a keyword in the search tab. The system identifies the item from a predefined list and provides minimal dosage recommendations based on your dog\'s breed (you can adjust manually). You can set the number of pills, required administrations, and frequency for recurring medications.',
    category: 'Health & Medical',
    icon: <MdVaccines className="w-5 h-5" />
  },
  {
    id: 'health-2',
    question: 'What are medication reminders and how do they work?',
    answer: 'The system reminds you to administer medications and confirm they were given based on the schedule you set. When supply is running low, you\'ll receive reminders to renew the supply or prescription for chronic medications. Vaccination reminders are free, while medication reminders may require Premium.',
    category: 'Health & Medical',
    icon: <MdVaccines className="w-5 h-5" />
  },
  {
    id: 'health-3',
    question: 'What is the Medical Record feature?',
    answer: 'The Medical Record feature (Premium) allows you to document your dog\'s medical history inside the app, making it accessible anywhere and to any veterinarian. You can photograph medical summaries for OCR processing, and export the full record as a PDF or QR code for emergencies or when visiting new veterinarians.',
    category: 'Health & Medical',
    icon: <MdVaccines className="w-5 h-5" />
  },

  // Tracking Features
  {
    id: 'tracking-1',
    question: 'How does bathroom tracking work?',
    answer: 'Perfect for puppies or dogs with house training issues, this feature logs every elimination event. Tap the "Poop" button and the system detects via GPS whether it was indoors or outdoors. You can also enter stool consistency. After several days, view graphs showing elimination patterns and improvement curves.',
    category: 'Tracking Features',
    icon: <MdPets className="w-5 h-5" />
  },
  {
    id: 'tracking-2',
    question: 'What can I track with Dog Log?',
    answer: 'You can track bathroom events, vaccinations, weight, medication treatments, food (type and price), general dog info (name, birth date, breed, sex), authorized users, and medical events like diarrhea or vomiting. The app stores all this data for comprehensive health monitoring.',
    category: 'Tracking Features',
    icon: <MdPets className="w-5 h-5" />
  },

  // Maps & Community
  {
    id: 'maps-1',
    question: 'What is the Dog Map feature?',
    answer: 'The Dog Map displays every location meaningful to dog owners with navigation support. You can filter by service type (veterinarians, supply stores, etc.), view Google reviews inside the app, and share discovered locations with your community. Data comes from Google Maps plus additional relevant sources.',
    category: 'Maps & Community',
    icon: <MdMap className="w-5 h-5" />
  },
  {
    id: 'maps-2',
    question: 'How does the Community feature work?',
    answer: 'This experimental feature allows you to create groups with other dog owners to share locations, plus breed-specific communities where owners can share medical conditions, issues, or photos. Communities support text posts, photo uploads, and location sharing in a status-style feed.',
    category: 'Maps & Community',
    icon: <MdGroup className="w-5 h-5" />
  },

  // Premium & Pricing
  {
    id: 'premium-1',
    question: 'What features are free vs. Premium?',
    answer: 'Free features include: vaccination tracking, basic medication tracking (without reminders), bathroom tracking, weight tracking, breed entry, walk notifications, keyword breed search, and maps. Premium features include: medical record access, medication reminders, camera breed identification, mixed breed support (3+ types), AI training tips, and advanced analytics.',
    category: 'Premium & Pricing',
    icon: <MdSecurity className="w-5 h-5" />
  },
  {
    id: 'premium-2',
    question: 'What AI features does Dog Log offer?',
    answer: 'AI powers several features including: personalized training modules with video instructions and form correction, medical record summarization for emergencies, daily tips based on health status and weather, and behavioral pattern analysis for bathroom training issues (Premium).',
    category: 'Premium & Pricing',
    icon: <MdSmartphone className="w-5 h-5" />
  }
];

const categories = ['Getting Started', 'Dog Management', 'Health & Medical', 'Tracking Features', 'Maps & Community', 'Premium & Pricing'];

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <span className="text-5xl">💡</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Dog Log features, setup, and usage.
          </p>
        </div>

        {/* Category Filter */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-8">
              {filteredFAQs.map((faq, index) => (
                <div key={faq.id} className={`${index !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}>
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full text-left py-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200 rounded-lg px-4 -mx-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        {faq.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {faq.question}
                        </h3>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {expandedItems.includes(faq.id) ? (
                        <MdExpandLess className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <MdExpandMore className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="pb-6 px-4 -mx-4">
                      <div className="ml-14 bg-gray-50 dark:bg-gray-700/20 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you get the most out of Dog Log.
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <a
                  href="/support/contact"
                  className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Contact Support
                </a>
                <a
                  href="mailto:support@doglog.app"
                  className="inline-block px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors duration-200 border-2 border-white/20"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
