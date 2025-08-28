// API client for making requests to your Next.js API routes
// This replaces direct calls to the external backend

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api'; // Your Next.js API routes
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Don't log 401 errors for auth endpoints - they're expected when user isn't authenticated
        const isAuthCheck = endpoint === '/auth/me';
        const isUnauthorized = response.status === 401;
        
        if (!(isAuthCheck && isUnauthorized)) {
          console.error(`API request failed: ${endpoint}`, data.error || 'Request failed');
        }
        
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      // Don't log network errors for auth checks - they're expected
      const isAuthCheck = endpoint === '/auth/me';
      if (!isAuthCheck) {
        console.error(`API request failed: ${endpoint}`, error);
      }
      throw error;
    }
  }

  // Authentication methods
  async signin(email: string, password: string) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name: string, email: string, password: string, acceptedTerms: boolean) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, acceptedTerms }),
    });
  }

  async signout() {
    return this.request('/auth/signout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Dog methods
  async getDogs() {
    return this.request('/dogs');
  }

  async getDogById(id: string) {
    return this.request(`/dogs/${id}`);
  }

  async addDog(dogData: { name: string; breed: string; birthday: string; gender: string }) {
    return this.request('/dogs', {
      method: 'POST',
      body: JSON.stringify(dogData),
    });
  }

  async updateDog(id: string, dogData: { name: string; breed: string; birthday: string; gender: string }) {
    return this.request(`/dogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dogData),
    });
  }

  async updateDogWithFile(id: string, formData: FormData) {
    // For file uploads, don't set Content-Type (let browser set it with boundary)
    return this.request(`/dogs/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {}, // Override default Content-Type
    });
  }

  async deleteDog(id: string) {
    return this.request(`/dogs/${id}`, {
      method: 'DELETE',
    });
  }

  // Potty methods
  async getPottyRecords(dogId: string) {
    return this.request(`/potty?dogId=${dogId}`);
  }

  async createPottyRecord(pottyData: {
    dog: string;
    date: string;
    type: string;
    environment?: string;
    healthFlags?: string[];
    note?: string;
    coordinates?: { latitude: number; longitude: number };
  }) {
    return this.request('/potty', {
      method: 'POST',
      body: JSON.stringify(pottyData),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for better TypeScript support
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Dog {
  _id: string;
  name: string;
  breed: string;
  birthday: string;
  gender: string;
  imageUrl?: string;
  collaborators?: Array<{
    role: string;
    user: User;
  }>;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface DogsResponse {
  data: {
    userDogs: Dog[];
  };
}

export interface DogResponse {
  data: {
    getDogById?: Dog;
    addDog?: Dog;
    updateDog?: Dog;
    deleteDog?: {
      success: boolean;
      message: string;
    };
  };
}

export interface PottyRecord {
  _id: string;
  date: string;
  type: string;
  environment: string;
  healthFlags?: string[];
  note?: string;
  coordinates?: { latitude: number; longitude: number };
  addedBy: User;
  createdAt: string;
}

export interface PottyResponse {
  data: PottyRecord[];
  success: boolean;
  message?: string;
}

export interface CreatePottyResponse {
  data: PottyRecord;
  success: boolean;
  message?: string;
}
