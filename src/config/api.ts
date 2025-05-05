// API configuration
const getBaseUrl = () => {
  // Use Vite's environment variable, fallback to localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
};

export const API_BASE_URL = getBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  events: {
    my: `${API_BASE_URL}/api/events/my`,
    create: `${API_BASE_URL}/api/events`,
    get: (eventId: number) => `${API_BASE_URL}/api/events/${eventId}`,
  },
  categories: {
    all: `${API_BASE_URL}/api/categories`,
    active: `${API_BASE_URL}/api/categories/active`,
  },
  questions: {
    byCategory: (categoryId: number, count: number) =>
      `${API_BASE_URL}/api/category/${categoryId}/questions?count=${count}`,
    random: `${API_BASE_URL}/api/question`,
    checkAnswer: `${API_BASE_URL}/api/check-answer`,
  },
  difficulties: `${API_BASE_URL}/api/difficulties`,
  rounds: {
    create: `${API_BASE_URL}/api/rounds`,
    getQuestions: (roundId: number) =>
      `${API_BASE_URL}/api/rounds/${roundId}/questions`,
    get: (roundId: number) => `${API_BASE_URL}/api/rounds/${roundId}`,
  },
};
