'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Dog breeds enum (you can move this to a separate file later)
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

interface Dog {
  _id: string;
  name: string;
  breed?: string[];
  birthday?: string;
  gender?: 'MALE' | 'FEMALE';
  imageUrl?: string;
}

async function fetchDogById(dogId: string): Promise<Dog | null> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) {
    console.log('❌ No access token found');
    return null;
  }

  try {
    console.log('🔍 Fetching dog with ID:', dogId);
    
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            userDogs {
              _id
              name
              breed
              birthday
              gender
              imageUrl
            }
          }
        `,
      }),
    });

    console.log('📡 Fetch response status:', res.status);

    const json = await res.json();
    console.log('📄 Fetch response data:', json);

    const dogs = json.data?.userDogs || [];
    const foundDog = dogs.find((dog: Dog) => dog._id === dogId) || null;
    
    console.log('🐕 Found dog:', foundDog);
    
    return foundDog;
  } catch (error) {
    console.error('💥 Error fetching dog:', error);
    return null;
  }
}

async function updateDog(dogData: {
  dogId: string;
  name?: string;
  breed?: string[];
  birthday?: string;
  image?: File;
}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) {
    console.error('❌ No access token found');
    throw new Error('No access token');
  }

  console.log('🔧 updateDog called with data:', dogData);

  // If no image, use regular JSON request
  if (!dogData.image) {
    const variables = {
      updateDogDto: {
        dogId: dogData.dogId,
        ...(dogData.name && { name: dogData.name }),
        ...(dogData.breed && dogData.breed.length > 0 && { breed: dogData.breed }),
        ...(dogData.birthday && { birthday: dogData.birthday }),
        // ❌ Removed gender - not supported by UpdateDogDto schema
      }
    };

    console.log('📨 Sending JSON request with variables:', JSON.stringify(variables, null, 2));

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateDog($updateDogDto: UpdateDogDto!) {
              updateDog(updateDogDto: $updateDogDto) {
                _id
                name
                breed
                birthday
                gender
                imageUrl
              }
            }
          `,
          variables
        }),
      });

      console.log('📡 Update response status:', res.status);
      console.log('📡 Update response headers:', Object.fromEntries(res.headers.entries()));

      const result = await res.json();
      console.log('🔄 JSON response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('💥 Network error in JSON request:', error);
      throw error;
    }
  }

  // For file uploads, use FormData
  console.log('📎 Using FormData for file upload');
  
  const operations = {
    query: `
      mutation UpdateDog($updateDogDto: UpdateDogDto!) {
        updateDog(updateDogDto: $updateDogDto) {
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
      updateDogDto: {
        dogId: dogData.dogId,
        ...(dogData.name && { name: dogData.name }),
        ...(dogData.breed && dogData.breed.length > 0 && { breed: dogData.breed }),
        ...(dogData.birthday && { birthday: dogData.birthday }),
        // ❌ Removed gender - not supported by UpdateDogDto schema
        image: null // Will be mapped to the uploaded file
      }
    }
  };

  console.log('📎 FormData operations:', JSON.stringify(operations, null, 2));

  const formData = new FormData();
  formData.append('operations', JSON.stringify(operations));
  formData.append('map', JSON.stringify({ '0': ['variables.updateDogDto.image'] }));
  formData.append('0', dogData.image);

  console.log('📎 FormData contents:');
  console.log('  operations:', JSON.stringify(operations, null, 2));
  console.log('  map:', JSON.stringify({ '0': ['variables.updateDogDto.image'] }));
  console.log('  0: File:', dogData.image.name, dogData.image.size, 'bytes');

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        "x-apollo-operation-name": "UpdateDog"
      },
      body: formData,
    });

    console.log('📡 FormData response status:', res.status);
    console.log('📡 FormData response headers:', Object.fromEntries(res.headers.entries()));

    const result = await res.json();
    console.log('🔄 FormData response:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('💥 Network error in FormData request:', error);
    throw error;
  }
}

export default function EditDogPage() {
  const params = useParams();
  const router = useRouter();
  const dogId = params.id as string;

  console.log('🆔 Edit page loaded with dogId:', dogId);

  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Breed search and filtering
  const [breedSearch, setBreedSearch] = useState('');
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);

  // Filter breeds based on search
  const filteredBreeds = DOG_BREEDS.filter(breed =>
    breed.toLowerCase().includes(breedSearch.toLowerCase())
  );

  useEffect(() => {
    if (dogId) {
      console.log('🔄 useEffect: Fetching dog data...');
      
      fetchDogById(dogId).then(dogData => {
        if (dogData) {
          console.log('✅ Dog data loaded:', dogData);
          setDog(dogData);
          setName(dogData.name || '');
          setSelectedBreeds(dogData.breed || []);
          setBirthday(dogData.birthday ? dogData.birthday.split('T')[0] : '');
          setGender(dogData.gender || '');
          setPreviewUrl(dogData.imageUrl || '');
        } else {
          console.log('❌ No dog data found');
        }
        setLoading(false);
      });
    }
  }, [dogId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📷 Image selected:', file.name, file.size, file.type);
      setImageFile(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    console.log('🚀 Form submission started');

    try {
      const updateData = {
        dogId,
        name: name || undefined,
        breed: selectedBreeds.length > 0 ? selectedBreeds : undefined,
        birthday: birthday || undefined,
        // ❌ Removed gender from update data - backend doesn't support it
        image: imageFile || undefined,
      };

      console.log('🐕 Updating dog with data:', updateData);
      
      const result = await updateDog(updateData);
      
      console.log('📝 Update result received:', result);
      
      if (result.errors) {
        console.error('❌ GraphQL errors:', result.errors);
        setError(result.errors[0].message);
      } else if (result.data?.updateDog) {
        console.log('✅ Dog updated successfully:', result.data.updateDog);
        router.push('/dogs');
      } else {
        console.log('⚠️ No data returned from update');
        setError('Update failed - no data returned');
      }
    } catch (err) {
      console.error('💥 Network/parsing error:', err);
      setError('Failed to update dog - network error');
    } finally {
      setSaving(false);
      console.log('🏁 Form submission completed');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="text-center text-gray-500 dark:text-gray-400">Loading dog details...</div>
      </main>
    );
  }

  if (!dog) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="text-center text-red-500">Dog not found</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-8">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dogs" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
            ← Back to Dogs
          </Link>
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">Edit {dog.name}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dog Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Gender - Display only, not editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender (Display Only)
            </label>
            <select
              value={gender}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              * Gender cannot be updated - backend limitation
            </p>
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
              disabled={saving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2 px-4 rounded-lg shadow transition"
            >
              {saving ? 'Updating...' : 'Update Dog'}
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