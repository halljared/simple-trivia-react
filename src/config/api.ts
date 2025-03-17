// API configuration
const getBaseUrl = () => {
  // For local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }

  // For production - can be overridden by environment variable
  return process.env.REACT_APP_API_URL || window.location.origin;
};

export const API_BASE_URL = getBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
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
};
