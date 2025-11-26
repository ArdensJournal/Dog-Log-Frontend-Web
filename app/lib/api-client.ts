// API client for making requests to your Next.js API routes
// This replaces direct calls to the external backend

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/api"; // Your Next.js API routes
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Don't log 401 errors for auth endpoints - they're expected when user isn't authenticated
        const isAuthCheck = endpoint === "/auth/me";
        const isUnauthorized = response.status === 401;

        if (!(isAuthCheck && isUnauthorized)) {
          console.error(
            `API request failed: ${endpoint}`,
            data.error || "Request failed"
          );
          // Log detailed error information for debugging
          if (data.details) {
            console.error("Error details:", data.details);
          }
          if (data.message) {
            console.error("Error message:", data.message);
          }
        }

        throw new Error(data.message || data.error || "API request failed");
      }

      return data;
    } catch (error) {
      // Don't log network errors for auth checks - they're expected
      const isAuthCheck = endpoint === "/auth/me";
      if (!isAuthCheck) {
        console.error(`API request failed: ${endpoint}`, error);
      }
      throw error;
    }
  }

  // Authentication methods
  async signin(email: string, password: string) {
    return this.request("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(
    name: string,
    email: string,
    password: string,
    acceptedTerms: boolean
  ) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, acceptedTerms }),
    });
  }

  async signout() {
    return this.request("/auth/signout", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request("/auth/me");
  }

  // Dog methods
  async getDogs() {
    return this.request("/dogs");
  }

  async getDogById(id: string) {
    return this.request(`/dogs/${id}`);
  }

  async addDog(dogData: {
    name: string;
    breeds: string[];
    birthday: string;
    gender: string;
  }) {
    return this.request("/dogs", {
      method: "POST",
      body: JSON.stringify(dogData),
    });
  }

  async updateDog(
    id: string,
    dogData: {
      name: string;
      breeds: string[];
      birthday: string;
      gender: string;
    }
  ) {
    return this.request(`/dogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(dogData),
    });
  }

  async updateDogWithFile(id: string, formData: FormData) {
    // For file uploads, don't set Content-Type (let browser set it with boundary)
    return this.request(`/dogs/${id}`, {
      method: "PUT",
      body: formData,
      headers: {}, // Override default Content-Type
    });
  }

  async deleteDog(id: string) {
    return this.request(`/dogs/${id}`, {
      method: "DELETE",
    });
  }

  // Collaborator methods
  async addCollaborator(dogId: string, email: string, role: string) {
    return this.request(`/dogs/${dogId}/collaborators`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });
  }

  async removeCollaborator(dogId: string, collaboratorId: string) {
    return this.request(`/dogs/${dogId}/collaborators/${collaboratorId}`, {
      method: "DELETE",
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
    return this.request("/potty", {
      method: "POST",
      body: JSON.stringify(pottyData),
    });
  }

  // Vaccine methods
  async getVaccines() {
    return this.request("/vaccines");
  }

  // Vaccination methods
  async getVaccinations() {
    return this.request("/vaccinations");
  }

  async createVaccination(vaccinationData: {
    dogId: string;
    vaccineId: string;
    dateGiven: string;
    notes?: string;
    administeredBy?: string;
    nextDueDate?: string;
  }) {
    return this.request("/vaccinations", {
      method: "POST",
      body: JSON.stringify(vaccinationData),
    });
  }

  // Task methods
  async getTasks(options?: { dogId?: string }) {
    let endpoint = "/tasks";

    if (options?.dogId) {
      endpoint += `?dogId=${options.dogId}`;
    }

    return this.request(endpoint);
  }

  async createTask(taskData: {
    name: string;
    dog: string; // Dog ID
    date: string;
    description?: string;
    isCompleted?: boolean;
    vaccine?: string; // Vaccine MongoDB ObjectId (not name!)
  }) {
    // Ensure date is properly formatted as ISO string
    const taskDataToSend: any = { ...taskData };

    if (taskDataToSend.date) {
      const dateObj = new Date(taskDataToSend.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date format in createTask");
      }
      taskDataToSend.date = dateObj.toISOString();
    }

    console.log("📋 Creating task:", JSON.stringify(taskDataToSend, null, 2));

    return await this.request("/tasks", {
      method: "POST",
      body: JSON.stringify(taskDataToSend),
    });
  }

  async updateTask(
    taskId: string,
    updates: {
      name?: string;
      dog?: string;
      date?: string;
      description?: string;
      isCompleted?: boolean;
      vaccine?: string;
    }
  ) {
    console.log(
      `📋 Updating task ${taskId}:`,
      JSON.stringify(updates, null, 2)
    );

    return await this.request(`/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId: string) {
    console.log(`🗑️  Deleting task ${taskId}`);

    return await this.request(`/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  async completeTask(taskId: string, isCompleted: boolean = true) {
    console.log(
      `📋 ${isCompleted ? "Completing" : "Uncompleting"} task ${taskId}`
    );

    // Use updateTask to only update the isCompleted field
    return await this.updateTask(taskId, { isCompleted });
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
  breeds: string[];
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

export interface Vaccine {
  _id: string;
  name: string;
}

export interface VaccinesResponse {
  data: {
    findAllVaccines: Vaccine[];
  };
}

export interface Vaccination {
  _id: string;
  vaccine: Vaccine;
  dateGiven: string;
  notes?: string;
  administeredBy?: string;
  nextDueDate?: string;
  createdAt: string;
}

export interface DogWithVaccinations extends Dog {
  vaccinations: Vaccination[];
}

export interface VaccinationsResponse {
  data: {
    userDogs: DogWithVaccinations[];
  };
}

export interface CreateVaccinationResponse {
  data: {
    createVaccination: Vaccination;
  };
}

// Task interfaces
export interface Task {
  _id: string;
  name: string;
  description?: string;
  date: string;
  isCompleted: boolean;
  dog: {
    _id: string;
    name: string;
  };
  vaccine?: {
    _id: string;
    name: string;
  };
  addedBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  data: Task[];
  success: boolean;
  message?: string;
}

export interface TaskResponse {
  data: Task;
  success: boolean;
  message?: string;
}
