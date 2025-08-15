'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Dog breeds enum (same as edit page)
const DOG_BREEDS = [
  'Affenpinscher', 'AfghanHound', 'AiredaleTerrier', 'Akita', 'AlaskanMalamute',
  'AmericanEnglishCoonhound', 'AmericanEskimoDog', 'AmericanFoxhound', 'AmericanHairlessTerrier',
  'AmericanLeopardHound', 'AmericanStaffordshireTerrier', 'AmericanWaterSpaniel', 'AnatolianShepherdDog',
  'AppenzellerSennenhund', 'AustralianCattleDog', 'AustralianShepherd', 'AustralianTerrier',
  'Azawakh', 'BarbadoDaTerceira', 'Barbet', 'Basenji', 'BassetFauveDeBretagne', 'BassetHound',
  'Beagle', 'BeardedCollie', 'Beauceron', 'BedlingtonTerrier', 'BelgianLaekenois', 'BelgianMalinois',
  'BelgianSheepdog', 'BelgianTervuren', 'BergamascoSheepdog', 'BergerPicard', 'BerneseMountainDog',
  'BichonFrise', 'BiewerTerrier', 'BlackAndTanCoonhound', 'BlackRussianTerrier', 'Bloodhound',
  'BluetickCoonhound', 'Boerboel', 'Bolognese', 'BorderCollie', 'BorderTerrier', 'Borzoi',
  'BostonTerrier', 'BouvierDesFlandres', 'Boxer', 'BraccoItaliano', 'Briard', 'Brittany',
  'Broholmer', 'BrusselsGriffon', 'BullTerrier', 'Bulldog', 'Bullmastiff', 'CairnTerrier',
  'CanaanDog', 'CaneCorso', 'CardiganWelshCorgi', 'CavalierKingCharlesSpaniel', 'CeskyTerrier',
  'ChesapeakeBayRetriever', 'Chihuahua', 'ChineseCrested', 'ChineseSharPei', 'Chinook', 'ChowChow',
  'ClumberSpaniel', 'CockerSpaniel', 'Collie', 'CotonDeTulear', 'CurlyCoatedRetriever',
  'CzechoslovakianVlcak', 'Dachshund', 'Dalmatian', 'DandieDinmontTerrier', 'DanishSwedishFarmdog',
  'DobermanPinscher', 'DogoArgentino', 'DogueDeBordeaux', 'DutchShepherd', 'EnglishCockerSpaniel',
  'EnglishFoxhound', 'EnglishSetter', 'EnglishSpringerSpaniel', 'EnglishToySpaniel',
  'EntlebucherMountainDog', 'FieldSpaniel', 'FinnishLapphund', 'FinnishSpitz', 'FlatCoatedRetriever',
  'FrenchBulldog', 'GermanPinscher', 'GermanShepherdDog', 'GermanShorthairedPointer',
  'GermanWirehairedPointer', 'GiantSchnauzer', 'GlenOfImaalTerrier', 'GoldenRetriever', 'GordonSetter',
  'GrandBassetGriffonVendeen', 'GreatDane', 'GreatPyrenees', 'GreaterSwissMountainDog', 'Greyhound',
  'Harrier', 'Havanese', 'IbizanHound', 'IcelandicSheepdog', 'IrishRedAndWhiteSetter', 'IrishSetter',
  'IrishTerrier', 'IrishWaterSpaniel', 'IrishWolfhound', 'ItalianGreyhound', 'JapaneseAkitainu',
  'JapaneseChin', 'KaiKen', 'Keeshond', 'KerryBlueTerrier', 'Komondor', 'Kuvasz', 'LabradorRetriever',
  'LagottoRomagnolo', 'LancashireHeeler', 'Leonberger', 'LhasaApso', 'Lowchen', 'Maltese',
  'ManchesterTerrierStandard', 'ManchesterTerrierToy', 'Mastiff', 'MiniatureAmericanShepherd',
  'MiniatureBullTerrier', 'MiniaturePinscher', 'MiniatureSchnauzer', 'Mudi', 'NeapolitanMastiff',
  'NederlandseKooikerhondje', 'Newfoundland', 'NorfolkTerrier', 'Norrbottenspets', 'NorwegianBuhund',
  'NorwegianElkhound', 'NorwegianLundehund', 'NorwichTerrier', 'NovaScotiaDuckTollingRetriever',
  'OldEnglishSheepdog', 'Otterhound', 'Papillon', 'ParsonRussellTerrier', 'Pekingese',
  'PembrokeWelshCorgi', 'PeruvianIncaOrchid', 'PetitBassetGriffonVendeen', 'PharaohHound', 'PlottHound',
  'Pointer', 'PolishLowlandSheepdog', 'Pomeranian', 'PoodleMiniature', 'PoodleStandard', 'PoodleToy',
  'PortuguesePodengo', 'PortuguesePodengoPequeno', 'PortugueseWaterDog', 'Pug', 'Puli', 'Pumi',
  'PyreneanShepherd', 'RatTerrier', 'RedloneCoonhound', 'RhodesianRidgeback', 'Rottweiler',
  'RussellTerrier', 'RussianToy', 'SaintBernard', 'Saluki', 'Samoyed', 'Schipperke', 'ScottishDeerhound',
  'ScottishTerrier', 'SealyhamTerrier', 'ShetlandSheepdog', 'ShibaInu', 'ShihTzu', 'SiberianHusky',
  'SilkyTerrier', 'SkyeTerrier', 'Sloughi', 'SmallMunsterlander', 'SoftCoatedWheatenTerrier',
  'SpanishWaterDog', 'SpinoneItaliano', 'StaffordshireBullTerrier', 'StandardSchnauzer', 'SussexSpaniel',
  'SwedishVallhund', 'TibetanMastiff', 'TibetanSpaniel', 'TibetanTerrier', 'ToyFoxTerrier',
  'TreeingWalkerCoonhound', 'Vizsla', 'Weimaraner', 'WelshSpringerSpaniel', 'WelshTerrier',
  'WestHighlandWhiteTerrier', 'Whippet', 'WirehairedPointingGriffon', 'WirehairedVizsla',
  'Xoloitzcuintli', 'YorkshireTerrier'
];

export default function AddDogPage() {
  const [name, setName] = useState('');
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Breed search and filtering
  const [breedSearch, setBreedSearch] = useState('');
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);

  // Filter breeds based on search
  const filteredBreeds = DOG_BREEDS.filter(breed =>
    breed.toLowerCase().includes(breedSearch.toLowerCase())
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📷 Image selected:', file.name, file.size, file.type);
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddBreed = (breed: string) => {
    if (!selectedBreeds.includes(breed)) {
      setSelectedBreeds([...selectedBreeds, breed]);
      console.log(`🐕 Added breed: ${breed}`);
    }
    setBreedSearch('');
    setShowBreedDropdown(false);
  };

  const handleRemoveBreed = (breed: string) => {
    setSelectedBreeds(selectedBreeds.filter(b => b !== breed));
    console.log(`🐕 Removed breed: ${breed}`);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('You must be signed in to add a dog.');
      setLoading(false);
      return;
    }

    console.log('🚀 Creating dog with data:', {
      name,
      breeds: selectedBreeds,
      birthday,
      gender,
      hasImage: !!image
    });

    try {
      // Use the createDog mutation with proper FormData if image is included
      if (image) {
        // Use FormData for file upload
        const formData = new FormData();
        
        const operations = {
          query: `
            mutation CreateDog($createDogDto: CreateDogDto!) {
              createDog(createDogDto: $createDogDto) {
                _id
                name
                breed
                birthday
                gender
                imageUrl
              }
            }
          `,
          variables: {
            createDogDto: {
              name,
              breed: selectedBreeds.length > 0 ? selectedBreeds : [],
              birthday: birthday || null,
              gender: gender || null,
              image: null // Will be mapped to the uploaded file
            }
          }
        };

        formData.append('operations', JSON.stringify(operations));
        formData.append('map', JSON.stringify({ '0': ['variables.createDogDto.image'] }));
        formData.append('0', image);

        console.log('📎 Sending FormData request for dog creation with image');

        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            "x-apollo-operation-name": "CreateDog"
          },
          body: formData,
        });

        const json = await res.json();
        
        if (json.errors) {
          console.error('❌ GraphQL errors:', json.errors);
          setError(json.errors[0]?.message || 'Failed to add dog.');
        } else {
          console.log('✅ Dog created successfully:', json.data.createDog);
          router.push('/dogs');
        }
      } else {
        // Use regular JSON request without image
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              mutation CreateDog($createDogDto: CreateDogDto!) {
                createDog(createDogDto: $createDogDto) {
                  _id
                  name
                  breed
                  birthday
                  gender
                  imageUrl
                }
              }
            `,
            variables: {
              createDogDto: {
                name,
                breed: selectedBreeds.length > 0 ? selectedBreeds : [],
                birthday: birthday || null,
                gender: gender || null,
              }
            }
          }),
        });

        const json = await res.json();
        
        if (json.errors) {
          console.error('❌ GraphQL errors:', json.errors);
          setError(json.errors[0]?.message || 'Failed to add dog.');
        } else {
          console.log('✅ Dog created successfully:', json.data.createDog);
          router.push('/dogs');
        }
      }
    } catch (err) {
      console.error('💥 Network/parsing error:', err);
      setError('Failed to add dog.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dogs" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
            ← Back to Dogs
          </Link>
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">Add a New Dog</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dog Name *
            </label>
            <input
              type="text"
              placeholder="Enter dog's name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Birthday
            </label>
            <input
              type="date"
              value={birthday}
              onChange={e => setBirthday(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          {/* Improved Breeds Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Breeds
            </label>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a breed..."
                value={breedSearch}
                onChange={(e) => {
                  setBreedSearch(e.target.value);
                  setShowBreedDropdown(true);
                }}
                onFocus={() => setShowBreedDropdown(true)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              
              {/* Dropdown with filtered breeds */}
              {showBreedDropdown && breedSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredBreeds.length > 0 ? (
                    filteredBreeds.slice(0, 10).map(breed => (
                      <button
                        key={breed}
                        type="button"
                        onClick={() => handleAddBreed(breed)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                      >
                        {breed}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                      No breeds found matching "{breedSearch}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Breeds Display */}
            {selectedBreeds.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected breeds:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBreeds.map(breed => (
                    <span
                      key={breed}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                    >
                      {breed}
                      <button
                        type="button"
                        onClick={() => handleRemoveBreed(breed)}
                        className="ml-2 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Tip: Start typing to search for breeds, then click to add them
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dog Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Dog preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-indigo-300 dark:border-indigo-600"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-center">{error}</div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-2 px-4 rounded-lg shadow transition"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Dog'}
            </button>
            <Link
              href="/dogs"
              className="flex-1 text-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow transition"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Click outside to close dropdown */}
        {showBreedDropdown && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setShowBreedDropdown(false)}
          />
        )}
      </div>
    </main>
  );
}