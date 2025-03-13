import { TriviaRound } from '../types/trivia';

interface RoundListProps {
    rounds: TriviaRound[];
    onAddRound: () => void;
    onEditRound: (roundId: string) => void;
    onDeleteRound: (roundId: string) => void;
}

export default function RoundList({ rounds, onAddRound, onEditRound, onDeleteRound }: RoundListProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Rounds</h2>
            <div className="space-y-3">
                {rounds.map(round => (
                    <div key={round.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                            <h3 className="font-medium">{round.name}</h3>
                            <p className="text-sm text-gray-600">
                                {round.questions.length} questions
                            </p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => onEditRound(round.id)}
                                className="px-3 py-1 bg-blue-500 text-white rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDeleteRound(round.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    onClick={onAddRound}
                    className="w-full p-3 border-2 border-dashed rounded text-gray-600 hover:bg-gray-50"
                >
                    + Add New Round
                </button>
            </div>
        </div>
    );
} 