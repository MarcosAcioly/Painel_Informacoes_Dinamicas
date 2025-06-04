import { ApiClient } from "../core/ApiClient.js";

class MoviesService {
  constructor() {
    this.apiClient = new ApiClient();
    this.apiKey = "9d88a667f3215783a4ae1382a65a9935"; // Chave da API (não use se for usar o token)
    this.baseUrl = "https://api.themoviedb.org/3";
    this.token =
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZDg4YTY2N2YzMjE1NzgzYTRhZTEzODJhNjVhOTkzNSIsIm5iZiI6MTczMjQ4MDY5OS4zMDMsInN1YiI6IjY3NDM4ZWJiZjNmMjkxOTEyZTk1NTk2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xOOxzpg9KsuMHV0epv8YjuR76KH4oLYdWzG5EZOZo8E";
  }

  async searchMovie(query, language = "pt-BR") {
    const url = `${this.baseUrl}/search/movie?query=${encodeURIComponent(
      query
    )}&language=${language}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    return await response.json();
  }

  async getPopularMovies() {
    const filtroInput = document.getElementById("filtro-filme");
    const filtro = filtroInput ? filtroInput.value : "";
    const url = `${this.baseUrl}/movie/popular?language=pt-BR`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    const data = await response.json();
    return data.results.filter((movie) => movie.title.includes(filtro));
  }

  async getMovieDetails(movieId, language = "pt-BR") {
    const url = `${this.baseUrl}/movie/${movieId}?language=${language}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    return await response.json();
  }
}

export { MoviesService };

// Função utilitária para uso externo (ex: main.js)
export async function getMovies() {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZDg4YTY2N2YzMjE1NzgzYTRhZTEzODJhNjVhOTkzNSIsIm5iZiI6MTczMjQ4MDY5OS4zMDMsInN1YiI6IjY3NDM4ZWJiZjNmMjkxOTEyZTk1NTk2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xOOxzpg9KsuMHV0epv8YjuR76KH4oLYdWzG5EZOZo8E";
  const url = `https://api.themoviedb.org/3/movie/popular?language=pt-BR`;
  const response = await fetch(url, {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZDg4YTY2N2YzMjE1NzgzYTRhZTEzODJhNjVhOTkzNSIsIm5iZiI6MTczMjQ4MDY5OS4zMDMsInN1YiI6IjY3NDM4ZWJiZjNmMjkxOTEyZTk1NTk2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xOOxzpg9KsuMHV0epv8YjuR76KH4oLYdWzG5EZOZo8E",
      "Content-Type": "application/json;charset=utf-8",
      accept: "application/json",
    },
  });
  const data = await response.json();
  return data.results.map((movie) => ({
    title: movie.title,
  }));
}
