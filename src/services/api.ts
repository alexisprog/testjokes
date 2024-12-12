import axios from "axios";
import { useErrorStore } from "@/src/store/useErrorStore";

const BASE_URL = "https://api.chucknorris.io/jokes";

export interface Joke {
  categories: string[];
  created_at: string;
  icon_url: string;
  id: string;
  updated_at: string;
  url: string;
  value: string;
}

export interface JokeCategory {
  name: string;
}

class ApiService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Puedes agregar headers globales aquí
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        let errorMessage = "Ha ocurrido un error";

        if (error.response) {
          // El servidor respondió con un código de error
          switch (error.response.status) {
            case 400:
              errorMessage = "Solicitud incorrecta";
              break;
            case 404:
              errorMessage = "No se encontró el recurso solicitado";
              break;
            case 429:
              errorMessage = "Demasiadas solicitudes. Intenta más tarde";
              break;
            case 500:
              errorMessage = "Error interno del servidor";
              break;
            default:
              errorMessage = "Error en la solicitud";
          }
        } else if (error.request) {
          // La solicitud se realizó pero no se recibió respuesta
          errorMessage = "No se pudo conectar con el servidor";
        }

        useErrorStore.getState().showError(errorMessage);
        return Promise.reject(error);
      }
    );
  }

  // Métodos para obtener chistes
  async getRandomJoke(): Promise<Joke> {
    const response = await this.api.get<Joke>("/random");
    return response.data;
  }

  async getJokeByCategory(category: string): Promise<Joke> {
    const response = await this.api.get<Joke>(`/random?category=${category}`);
    return response.data;
  }

  async searchJokes(query: string): Promise<{ result: Joke[] }> {
    const response = await this.api.get<{ result: Joke[] }>(
      `/search?query=${query}`
    );
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await this.api.get<string[]>("/categories");
    return response.data;
  }

  // Método genérico para realizar peticiones
  async request<T = any>({
    method = "GET",
    url,
    data = null,
    params = {},
    headers = {},
  }: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    url: string;
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
  }): Promise<T> {
    const response = await this.api.request<T>({
      method,
      url,
      data,
      params,
      headers,
    });
    return response.data;
  }
}

// Exportamos una única instancia
export const apiService = new ApiService();

// Hook personalizado para usar el servicio
export const useApi = () => {
  return {
    getRandomJoke: apiService.getRandomJoke.bind(apiService),
    getJokeByCategory: apiService.getJokeByCategory.bind(apiService),
    searchJokes: apiService.searchJokes.bind(apiService),
    getCategories: apiService.getCategories.bind(apiService),
    request: apiService.request.bind(apiService),
  };
};

// Ejemplo de uso:
/*
const { getRandomJoke, searchJokes } = useApi();

// Obtener un chiste aleatorio
const joke = await getRandomJoke();

// Buscar chistes
const results = await searchJokes("dog");

// Usar el método genérico
const customData = await request<CustomType>({
  method: "POST",
  url: "/custom-endpoint",
  data: { foo: "bar" }
});
*/
