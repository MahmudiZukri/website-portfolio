"use client";

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

const PROMPTS = [
  "What's your experience with Flutter?",
  "Show me your top projects.",
  "Are you open to new opportunities?",
  "What is your tech stack?",
];

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="text-xs font-bold bg-card hover:bg-primary text-foreground hover:text-primary-foreground px-3 py-1.5 transition-colors border-2 border-primary shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
