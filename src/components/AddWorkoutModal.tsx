import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface AddWorkoutModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

export function AddWorkoutModal({ onSave, onClose }: AddWorkoutModalProps) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
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
            ADD WORKOUT
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
              Workout Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              className="input-field w-full"
              placeholder="e.g., Push Day"
              autoFocus
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
            disabled={!name.trim()}
            className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Check className="w-5 h-5" />
            Add Workout
          </button>
        </div>
      </div>
    </div>
  );
}

