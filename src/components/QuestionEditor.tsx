import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TriviaQuestion } from '../types/trivia';

interface QuestionEditorProps {
    question: TriviaQuestion;
    onSave: (question: TriviaQuestion) => void;
    onCancel: () => void;
}

export default function QuestionEditor({ question, onSave, onCancel }: QuestionEditorProps) {
    const [editedQuestion, setEditedQuestion] = useState<TriviaQuestion>(question);

    return (
        <div className="space-y-3">
            <Input
                value={editedQuestion.questionText}
                onChange={e => setEditedQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                placeholder="Question Text"
            />
            
            <Select
                value={editedQuestion.type}
                onValueChange={(value) => setEditedQuestion(prev => ({ ...prev, type: value as TriviaQuestion['type'] }))}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="open-ended">Open Ended</SelectItem>
                </SelectContent>
            </Select>

            {editedQuestion.type === 'multiple-choice' && (
                <div className="space-y-2">
                    {editedQuestion.options?.map((option, index) => (
                        <Input
                            key={index}
                            value={option}
                            onChange={e => {
                                const newOptions = [...(editedQuestion.options || [])];
                                newOptions[index] = e.target.value;
                                setEditedQuestion(prev => ({ ...prev, options: newOptions }));
                            }}
                            placeholder={`Option ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            <Input
                value={editedQuestion.correctAnswer}
                onChange={e => setEditedQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                placeholder="Correct Answer"
            />

            <div className="flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => onSave(editedQuestion)}
                >
                    Save Question
                </Button>
            </div>
        </div>
    );
} 