import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Exercise } from '@/lib/types';

const AVAILABLE_TAGS = [
  'Chest',
  'Triceps',
  'Biceps',
  'Shoulders',
  'Back',
  'Lats',
  'Legs',
  'Warmup',
];

interface EditExerciseModalProps {
  exercise: Exercise | null;
  workoutDayId?: string;
  onSave: (exercise: Exercise) => void;
  onClose: () => void;
}

export function EditExerciseModal({ exercise, workoutDayId, onSave, onClose }: EditExerciseModalProps) {
  const isEditing = exercise !== null;
  const [name, setName] = useState(exercise?.name || '');
  const [muscleTags, setMuscleTags] = useState<string[]>(exercise?.muscleTags || []);
  const [isAnchor, setIsAnchor] = useState(exercise?.isAnchor || false);
  const [notes, setNotes] = useState(exercise?.notes || '');

  const handleToggleTag = (tag: string) => {
    setMuscleTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (!isEditing && !workoutDayId) return;
    
    const exerciseData: Exercise = isEditing && exercise
      ? {
          ...exercise,
          name: name.trim(),
          muscleTags,
          isAnchor,
          notes: notes.trim() || undefined,
        }
      : {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          workoutDayId: workoutDayId!,
          name: name.trim(),
          muscleTags,
          isAnchor,
          defaultScheme: '3x8-12',
          sortOrder: 999,
          notes: notes.trim() || undefined,
        };
    
    onSave(exerciseData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl tracking-wide text-foreground">
            {isEditing ? 'EDIT EXERCISE' : 'ADD EXERCISE'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Exercise Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full"
              placeholder="e.g., Bench Press"
            />
          </div>

          {/* Anchor Toggle */}
          <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-4">
            <div>
              <p className="font-medium text-foreground">Anchor Exercise</p>
              <p className="text-sm text-muted-foreground">
                Track progress more closely
              </p>
            </div>
            <button
              onClick={() => setIsAnchor(!isAnchor)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                isAnchor ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  isAnchor ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Muscle Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = muscleTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide transition-all ${
                      isSelected
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-secondary text-secondary-foreground border border-transparent hover:border-border'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific instructions or reminders..."
              className="input-field w-full resize-none h-24"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || (!isEditing && !workoutDayId)}
            className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Check className="w-5 h-5" />
            {isEditing ? 'Save Changes' : 'Add Exercise'}
          </button>
        </div>
      </div>
    </div>
  );
}
