import { useState } from 'react';
import { TriviaRound, TriviaQuestion } from '../types/trivia';
import QuestionEditor from './QuestionEditor';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RoundEditorProps {
    round: TriviaRound;
    onSave: (round: TriviaRound) => void;
    onComplete: () => void;
}

export default function RoundEditor({ round, onSave, onComplete }: RoundEditorProps) {
    const [editedRound, setEditedRound] = useState<TriviaRound>(round);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

    const addQuestion = () => {
        const newQuestion: TriviaQuestion = {
            id: crypto.randomUUID(),
            questionText: '',
            answerText: '',
            points: 1,
            type: 'multiple-choice',
            difficulty: 'medium',
            options: ['', '', '', '']
        };
        setEditedRound(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));
        setEditingQuestionId(newQuestion.id);
    };

    const updateQuestion = (updatedQuestion: TriviaQuestion) => {
        setEditedRound(prev => ({
            ...prev,
            questions: prev.questions.map(q =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            )
        }));
        setEditingQuestionId(null);
    };

    const deleteQuestion = (questionId: string) => {
        setEditedRound(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== questionId)
        }));
    };

    const handleSave = () => {
        onSave(editedRound);
        onComplete();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Editing Round: {editedRound.name}</h2>
                <Button onClick={handleSave} variant="default">
                    Complete Round
                </Button>
            </div>

            {/* Round Details */}
            <Card>
                <CardContent className="space-y-2 pt-6">
                    <input
                        type="text"
                        value={editedRound.name}
                        onChange={e => setEditedRound(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Round Name"
                        className="p-2 border rounded w-full"
                    />
                    <textarea
                        value={editedRound.description || ''}
                        onChange={e => setEditedRound(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Round Description"
                        className="p-2 border rounded w-full"
                    />
                </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-3">
                {editedRound.questions.map(question => (
                    <Card key={question.id}>
                        <CardContent className="pt-6">
                            {editingQuestionId === question.id ? (
                                <QuestionEditor
                                    question={question}
                                    onSave={updateQuestion}
                                    onCancel={() => setEditingQuestionId(null)}
                                />
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{question.questionText || '(No question text)'}</p>
                                        <p className="text-sm text-gray-600">
                                            {question.type} - {question.points} points
                                        </p>
                                    </div>
                                    <div className="space-x-2">
                                        <Button
                                            onClick={() => setEditingQuestionId(question.id)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => deleteQuestion(question.id)}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                <Button
                    onClick={addQuestion}
                    variant="outline"
                    className="w-full"
                >
                    + Add New Question
                </Button>
            </div>
        </div>
    );
} 