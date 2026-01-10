import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface SkillsInputProps {
    value: string[];
    onChange: (skills: string[]) => void;
    placeholder?: string;
}

export function SkillsInput({
    value = [],
    onChange,
    placeholder = 'Add a skill...',
}: SkillsInputProps) {
    const [inputValue, setInputValue] = useState('');

    const addSkill = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
            setInputValue('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        onChange(value.filter((skill) => skill !== skillToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className="space-y-3">
            {/* Skill Chips */}
            <AnimatePresence mode="popLayout">
                {value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {value.map((skill) => (
                            <motion.div
                                key={skill}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Badge
                                    variant="secondary"
                                    className="group flex items-center gap-1 px-3 py-1.5 text-sm"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="ml-1 rounded-full p-0.5 transition-colors hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
            {/* Input Field */}
            <div className="flex gap-2">
                <Input
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-background/50 backdrop-blur-sm"
                />
                <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    size="icon"
                    disabled={!inputValue.trim()}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <p className="text-xs text-muted-foreground">
                Press Enter or click + to add
            </p>
        </div>
    );
}
