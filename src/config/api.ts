// API configuration
const getBaseUrl = () => {
  // Use Vite's environment variable, fallback to localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  events: {
    my: `${API_BASE_URL}/events/my`,
    create: `${API_BASE_URL}/events`,
    get: (eventId: number) => `${API_BASE_URL}/events/${eventId}`,
  },
  categories: {
    all: `${API_BASE_URL}/categories`,
    active: `${API_BASE_URL}/categories/active`,
  },
  questions: {
    byCategory: (categoryId: number, count: number) =>
      `${API_BASE_URL}/category/${categoryId}/questions?count=${count}`,
    random: `${API_BASE_URL}/question`,
    checkAnswer: `${API_BASE_URL}/check-answer`,
  },
  difficulties: `${API_BASE_URL}/difficulties`,
  rounds: {
    create: `${API_BASE_URL}/rounds`,
    getQuestions: (roundId: number) =>
      `${API_BASE_URL}/rounds/${roundId}/questions`,
    get: (roundId: number) => `${API_BASE_URL}/rounds/${roundId}`,
  },
};
