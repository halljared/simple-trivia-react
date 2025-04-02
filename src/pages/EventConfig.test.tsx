import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import EventConfig from './EventConfig';
import { useTriviaStore } from '../stores/triviaStore'; // Path to your store
import { TriviaEvent, TriviaRound } from '../types/trivia'; // Path to your types

// --- Mocking Dependencies ---

// 1. Mock the Zustand store
// We tell Vitest that whenever 'useTriviaStore' is imported, it should use our mock version instead.
vi.mock('../stores/triviaStore');

// 2. Mock the router hook
// We need to mock this because the component uses useNavigate
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', async (importOriginal) => {
  // Keep original exports, but override useNavigate
  const original =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...original,
    useNavigate: () => mockNavigate, // Return our mock function when useNavigate is called
  };
});

// --- Test Suite ---

describe('EventConfig Page', () => {
  // Define mock functions and initial state for the store
  // These will be used within our tests to control the store's behavior
  const mockSetEvent = vi.fn();
  const mockUpdateRound = vi.fn();
  const mockDeleteRound = vi.fn();
  const mockAddRound = vi.fn();

  const mockInitialEvent: TriviaEvent = {
    id: 'test-event-123',
    name: 'My Test Event',
    date: new Date(),
    host: 'Test Host',
    rounds: [
      { id: 'round-1', name: 'Round One', questions: [] },
      { id: 'round-2', name: 'Round Two', questions: [] },
    ] as TriviaRound[], // Type assertion might be needed depending on your exact types
    status: 'upcoming',
  };

  // Reset mocks and setup the store mock before each test
  beforeEach(() => {
    vi.clearAllMocks(); // Clear call history for all mocks

    // Define the return value for the mocked useTriviaStore hook
    // We cast the mock implementation to the expected type
    vi.mocked(useTriviaStore).mockReturnValue({
      currentEvent: mockInitialEvent, // Start with a defined event for most tests
      setEvent: mockSetEvent,
      updateRound: mockUpdateRound,
      deleteRound: mockDeleteRound,
      addRound: mockAddRound,
    });
  });

  // --- Test Cases ---

  it('should render the event configuration elements', () => {
    render(<EventConfig />);

    // Check if the main title is rendered
    expect(
      screen.getByRole('heading', { name: /configure event/i })
    ).toBeInTheDocument();

    // Check if the event name TextField is rendered with the correct value from the store
    expect(screen.getByLabelText(/event name/i)).toHaveValue(
      mockInitialEvent.name
    );

    // Check if the RoundList component is likely rendered (we can look for its title or mock it)
    // For now, let's check if "Round One" appears, assuming RoundList renders round names.
    expect(screen.getByText('Round One')).toBeInTheDocument();
  });

  it('should initialize a new event if currentEvent is initially null', async () => {
    // Override the store mock for this specific test
    vi.mocked(useTriviaStore).mockReturnValue({
      currentEvent: null, // Start with no event
      setEvent: mockSetEvent,
      updateRound: mockUpdateRound,
      deleteRound: mockDeleteRound,
      addRound: mockAddRound,
    });

    render(<EventConfig />);

    // The component initially returns null, then useEffect runs.
    // We need to wait for the setEvent call within useEffect.
    await waitFor(() => {
      // Check that setEvent was called because currentEvent was null
      expect(mockSetEvent).toHaveBeenCalledTimes(1);
      // Check if it was called with an object containing the expected structure
      expect(mockSetEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: '', // Initial name
          rounds: [], // Initial empty rounds
          status: 'upcoming',
          // We don't know the exact ID or date, so check they exist and are the right type
          id: expect.any(String),
          date: expect.any(Date),
        })
      );
    });

    // Note: After setEvent is called, React would re-render.
    // Testing the re-rendered output after initialization might require more setup
    // or splitting initialization logic into a custom hook for easier testing.
  });

  it('should call setEvent when the event name is changed', async () => {
    const user = userEvent.setup();
    render(<EventConfig />);

    const eventNameInput = screen.getByLabelText(/event name/i);
    const newEventName = 'My Updated Event Name';

    // Simulate user typing in the TextField
    await user.clear(eventNameInput); // Clear existing value
    await user.type(eventNameInput, newEventName);

    // Check if setEvent was called with the updated event object
    expect(mockSetEvent).toHaveBeenCalledTimes(1);
    expect(mockSetEvent).toHaveBeenCalledWith(
      // It should be called with the original event spread, plus the new name
      expect.objectContaining({
        ...mockInitialEvent, // Ensure other properties are preserved
        name: newEventName,
      })
    );
  });

  it('should call navigate when handleEditRound is triggered (e.g., via RoundList prop)', () => {
    render(<EventConfig />);

    // To test handleEditRound, we need to simulate the onEditRound prop being called
    // from the RoundList component. React Testing Library allows us to get props.
    const roundListComponent = screen.getByText('Round One').closest('ul, div'); // Adjust selector based on RoundList's structure

    // A more direct way: Find the RoundList via a test-id or its rendered content,
    // then simulate the prop call. Since RoundList is complex, let's test the handler directly
    // by finding *something* related to the round and simulating the interaction
    // that *should* trigger handleEditRound.

    // **Alternative/Simpler Approach (if RoundList internals are complex):**
    // We can test that the correct `onEditRound` handler is passed to `RoundList`.
    // This requires mocking RoundList itself.

    // **Let's test the handler logic directly:**
    // We can't directly call handleEditRound from outside, but we know it's passed
    // as `onEditRound` to `RoundList`. We can check if `RoundList` receives it.

    // **Even simpler for this specific case:**
    // Let's assume RoundList has an "Edit" button for each round.
    // We'll find the "Edit" button associated with "Round One" and click it.
    // Note: This relies on RoundList rendering an accessible button.
    // You might need to adjust the query based on RoundList's actual output.

    // Find the container/element for the first round
    const roundOneElement = screen.getByText('Round One');
    // Find an edit button within/near the round one element (adjust role/name)
    const editButton = screen.getAllByRole('button', { name: /edit/i })[0]; // Assuming first edit button corresponds to first round

    // Simulate click on the edit button
    userEvent.click(editButton); // userEvent is generally preferred over fireEvent

    // Check if navigate was called with the correct arguments
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({
      to: `/events/${mockInitialEvent.id}/rounds/round-1`, // Assuming round-1 is the ID of the first round
    });
  });

  // Add more tests:
  // - Test that onUpdateRound is called when RoundList triggers it.
  // - Test that onDeleteRound is called when RoundList triggers it.
  // - Test that onAddRound is called when RoundList triggers it.
  //   (These would be similar to the handleEditRound test - find the relevant
  //    element rendered by RoundList and interact with it, then check the corresponding mock store function)
});
