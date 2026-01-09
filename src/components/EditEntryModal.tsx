import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Entry } from '@/lib/types';
import { format } from 'date-fns';

interface EditEntryModalProps {
  entry: Entry;
  onSave: (entry: Entry) => void;
  onClose: () => void;
}

export function EditEntryModal({ entry, onSave, onClose }: EditEntryModalProps) {
  const [date, setDate] = useState(format(new Date(entry.date), 'yyyy-MM-dd'));
  const [sets, setSets] = useState(entry.sets);
  const [repsText, setRepsText] = useState(entry.repsText);
  const [weight, setWeight] = useState(entry.weight);
  const [unit, setUnit] = useState<'kg' | 'lbs'>(entry.unit);
  const [comment, setComment] = useState(entry.comment || '');

  const handleSave = () => {
    const updatedEntry: Entry = {
      ...entry,
      date: new Date(date).toISOString(),
      sets,
      repsText,
      weight,
      unit,
      comment: comment.trim() || undefined,
    };
    onSave(updatedEntry);
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
            EDIT ENTRY
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
          {/* Date */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field w-full"
            />
          </div>

          {/* Sets, Reps, Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                Sets
              </label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(parseInt(e.target.value) || 0)}
                className="input-field w-full text-center"
                min={1}
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                Reps
              </label>
              <input
                type="text"
                value={repsText}
                onChange={(e) => setRepsText(e.target.value)}
                className="input-field w-full text-center"
                placeholder="8-12"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="input-field w-full text-center pr-10"
                  min={0}
                  step={0.5}
                />
                <button
                  onClick={() => setUnit(u => u === 'kg' ? 'lbs' : 'kg')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-primary"
                >
                  {unit}
                </button>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Note (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did it feel?"
              className="input-field w-full resize-none h-20"
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
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

