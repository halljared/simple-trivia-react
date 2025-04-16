import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import EventConfig from './EventConfig';
import { useTriviaStore } from '../stores/triviaStore'; // Path to your store
// Make sure TriviaEvent type allows null for initial state testing
import { TriviaEvent, NewTriviaRound } from '../types/trivia'; // Path to your types

// --- Mocking Dependencies ---

vi.mock('../stores/triviaStore');

const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

// --- Test Suite ---

describe('EventConfig Page', () => {
  // --- Test-scoped state for the mock store ---
  let mockCurrentEventInTest: TriviaEvent | null = null; // Start as null or with initial, reset in beforeEach

  // --- Mock implementations for store actions ---
  const mockUpdateRound = vi.fn();
  const mockDeleteRound = vi.fn();
  const mockAddRound = vi.fn();

  // Make setEvent stateful: it updates our test-scoped variable
  const mockSetEvent = vi.fn((newEventData: TriviaEvent | null) => {
    mockCurrentEventInTest = newEventData;
  });

  // --- Define the initial state structure ---
  // Using a function to get a fresh copy each time it's needed
  const getMockInitialEvent = (): TriviaEvent => ({
    id: 'test-event-123',
    name: 'My Test Event',
    // Use a fixed date for consistency or mock new Date() globally
    date: new Date(2025, 3, 2, 12, 0, 0), // Example: April 2, 2025, 12:00:00
    host: 'Test Host',
    rounds: [
      { id: 'round-1', name: 'Round One', questions: [] },
      { id: 'round-2', name: 'Round Two', questions: [] },
    ] as NewTriviaRound[],
    status: 'upcoming',
  });

  // --- Reset mocks and setup the stateful store mock before each test ---
  beforeEach(() => {
    // Reset all mock function call history
    vi.clearAllMocks();

    // Reset the test-scoped state to a fresh copy of the initial event
    mockCurrentEventInTest = getMockInitialEvent();

    // Use mockImplementation to provide the stateful mock
    vi.mocked(useTriviaStore).mockImplementation(() => ({
      // Return the *current* value of our test-scoped state
      currentEvent: mockCurrentEventInTest,
      // Provide the stateful setEvent and other mock functions
      setEvent: mockSetEvent,
      updateRound: mockUpdateRound,
      deleteRound: mockDeleteRound,
      addRound: mockAddRound,
    }));
  });

  // --- Test Cases ---

  it('should render the event configuration elements', () => {
    render(<EventConfig />);

    expect(
      screen.getByRole('heading', { name: /configure event/i })
    ).toBeInTheDocument();

    // Check initial value based on the state set in beforeEach
    expect(screen.getByLabelText(/event name/i)).toHaveValue(
      getMockInitialEvent().name // Check against the defined initial name
    );

    expect(screen.getByText('Round One')).toBeInTheDocument();
  });

  it('should initialize a new event if currentEvent is initially null', async () => {
    // --- Special setup for this test: Override the mock state ---
    // Set the initial state for *this specific test run* to null
    mockCurrentEventInTest = null;
    // Re-apply the mock implementation to use this null state initially
    // (Needed because beforeEach already ran)
    vi.mocked(useTriviaStore).mockImplementation(() => ({
      currentEvent: mockCurrentEventInTest, // Now starts as null
      setEvent: mockSetEvent, // Use the stateful one - it will update mockCurrentEventInTest
      updateRound: mockUpdateRound,
      deleteRound: mockDeleteRound,
      addRound: mockAddRound,
    }));
    // --- End special setup ---

    render(<EventConfig />);

    // Wait for the useEffect logic to run and call setEvent
    await waitFor(() => {
      expect(mockSetEvent).toHaveBeenCalledTimes(1);
      expect(mockSetEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: '',
          rounds: [],
          status: 'upcoming',
          id: expect.any(String),
          date: expect.any(Date),
        })
      );
    });

    // Optional: Verify the state variable was updated by the stateful mock
    await waitFor(() => {
      expect(mockCurrentEventInTest).toEqual(
        expect.objectContaining({ name: '' })
      );
    });

    // Optional: Check if the UI reflects the initialized state (e.g., empty input)
    // Note: Need to ensure component re-renders with the new state
    // await waitFor(() => {
    //    expect(screen.getByLabelText(/event name/i)).toHaveValue('');
    // });
    // This last check might be tricky depending on exact timing and might require
    // forcing a re-render or structuring the effect differently if needed.
  });

  // Modified test for changing the event name
  it('should update input value and call setEvent correctly', async () => {
    const user = userEvent.setup();
    render(<EventConfig />);
    const eventNameInput = screen.getByLabelText(/event name/i);
    const newValue = 'My Updated Event Name';

    // Check initial value from mock
    expect(eventNameInput).toHaveValue(getMockInitialEvent().name);

    await user.clear(eventNameInput);
    // Wait for the clear to be reflected
    await waitFor(() => {
      expect(eventNameInput).toHaveValue('');
    });

    await user.type(eventNameInput, newValue);
    // Wait for the new value to be reflected
    await waitFor(() => {
      expect(eventNameInput).toHaveValue(newValue);
    });

    // Verify the integration (setEvent was called)
    expect(mockSetEvent).toHaveBeenCalled();

    // Verify the last call arguments
    const expectedFinalEvent = {
      ...getMockInitialEvent(),
      name: newValue,
    };
    expect(mockSetEvent).toHaveBeenLastCalledWith(expectedFinalEvent);

    // Verify the test-scoped state reflects the final update
    expect(mockCurrentEventInTest).toEqual(expectedFinalEvent);
  });

  it('should call navigate when handleEditRound is triggered (e.g., via RoundList prop)', () => {
    // This test doesn't involve setEvent directly, should still work if the
    // initial state renders the necessary elements.

    render(<EventConfig />); // Uses initial state from beforeEach

    // Assuming RoundList renders an accessible button for editing:
    // If your RoundList doesn't render a button like this, the test needs adjustment.
    // You might need aria-label="Edit Round One" or similar on the button.
    // Let's *assume* such a button exists for this example:
    let editButton;
    try {
      // Try finding by a specific, accessible name first
      editButton = screen.getByRole('button', { name: /edit round one/i });
    } catch (e) {
      // Fallback: If specific name fails, try the generic 'edit' assumption again,
      // but be aware this is brittle. Add `aria-label` in the component!
      console.warn(
        "Could not find button with name 'Edit Round One'. Falling back to generic 'Edit'. Add accessible names (aria-label) to icon buttons in RoundList!"
      );
      editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    }

    // Check if button was found before clicking
    expect(editButton).toBeInTheDocument();

    // Simulate click
    userEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    // Check navigation arguments (using initial event ID from state)
    expect(mockNavigate).toHaveBeenCalledWith({
      to: `/events/${getMockInitialEvent().id}/rounds/round-1`, // Assumes round ID is 'round-1'
    });
  });

  // Add more tests for updateRound, deleteRound, addRound following similar patterns:
  // - Render with initial state.
  // - Simulate user interaction (e.g., click delete button for round-1).
  // - Assert that the corresponding mock function (e.g., mockDeleteRound) was called
  //   with the expected arguments (e.g., 'round-1').
});
