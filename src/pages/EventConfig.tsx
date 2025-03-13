import { useState } from 'react';
import { TriviaEvent, TriviaRound } from '../types/trivia';
import RoundEditor from '../components/RoundEditor';
import RoundList from '../components/RoundList';

export default function EventConfig() {
    const [event, setEvent] = useState<TriviaEvent>({
        id: crypto.randomUUID(),
        name: '',
        date: new Date(),
        host: '',
        rounds: [],
        status: 'upcoming'
    });
    const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

    const addNewRound = () => {
        const newRound: TriviaRound = {
            id: crypto.randomUUID(),
            name: `Round ${event.rounds.length + 1}`,
            roundNumber: event.rounds.length + 1,
            questions: []
        };
        setEvent(prev => ({
            ...prev,
            rounds: [...prev.rounds, newRound]
        }));
    };

    const updateRound = (updatedRound: TriviaRound) => {
        setEvent(prev => ({
            ...prev,
            rounds: prev.rounds.map(r => 
                r.id === updatedRound.id ? updatedRound : r
            )
        }));
    };

    const deleteRound = (roundId: string) => {
        setEvent(prev => ({
            ...prev,
            rounds: prev.rounds.filter(r => r.id !== roundId)
        }));
        if (selectedRoundId === roundId) {
            setSelectedRoundId(null);
        }
    };

    return (
        <div className="p-4">
            {/* Event Details Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Configure Event</h1>
                <input
                    type="text"
                    value={event.name}
                    onChange={e => setEvent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Event Name"
                    className="p-2 border rounded"
                />
                {/* Add other event fields as needed */}
            </div>

            {selectedRoundId ? (
                <RoundEditor
                    round={event.rounds.find(r => r.id === selectedRoundId)!}
                    onSave={updateRound}
                    onComplete={() => setSelectedRoundId(null)}
                />
            ) : (
                <RoundList
                    rounds={event.rounds}
                    onAddRound={addNewRound}
                    onEditRound={setSelectedRoundId}
                    onDeleteRound={deleteRound}
                />
            )}
        </div>
    );
} 