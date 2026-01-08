import { useState, useEffect } from 'react';
import { X, Check, TrendingUp, Minus } from 'lucide-react';
import { Exercise, Entry } from '@/lib/types';
import { getLatestEntry, generateId } from '@/lib/storage';

interface LogEntrySheetProps {
  exercise: Exercise;
  entries: Entry[];
  onSave: (entry: Entry) => void;
  onClose: () => void;
}

export function LogEntrySheet({ exercise, entries, onSave, onClose }: LogEntrySheetProps) {
  const latestEntry = getLatestEntry(entries, exercise.id);
  
  const [sets, setSets] = useState(latestEntry?.sets || 3);
  const [repsText, setRepsText] = useState(latestEntry?.repsText || '10');
  const [weight, setWeight] = useState(latestEntry?.weight || 0);
  const [unit, setUnit] = useState<'kg' | 'lbs'>(latestEntry?.unit || 'kg');
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);

  // Parse default scheme if no latest entry
  useEffect(() => {
    if (!latestEntry && exercise.defaultScheme) {
      const match = exercise.defaultScheme.match(/(\d+)x(\d+(?:-\d+)?)/);
      if (match) {
        setSets(parseInt(match[1]));
        setRepsText(match[2]);
      }
    }
  }, [latestEntry, exercise.defaultScheme]);

  const handleSaveAsLast = () => {
    if (!latestEntry) return;
    
    const entry: Entry = {
      id: generateId(),
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      sets: latestEntry.sets,
      repsText: latestEntry.repsText,
      weight: latestEntry.weight,
      unit: latestEntry.unit,
      comment: comment || undefined,
    };
    onSave(entry);
  };

  const handleSave = () => {
    const entry: Entry = {
      id: generateId(),
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      sets,
      repsText,
      weight,
      unit,
      comment: comment || undefined,
    };
    onSave(entry);
  };

  // Progress hint for anchor exercises
  const getProgressHint = () => {
    if (!exercise.isAnchor || !latestEntry) return null;
    
    // Parse reps range from defaultScheme
    const schemeMatch = exercise.defaultScheme.match(/(\d+)x(\d+)-?(\d+)?/);
    if (!schemeMatch) return null;
    
    const minReps = parseInt(schemeMatch[2]);
    const maxReps = schemeMatch[3] ? parseInt(schemeMatch[3]) : minReps;
    
    // Parse latest reps
    const latestReps = parseInt(latestEntry.repsText.split('-')[0]);
    
    if (latestReps >= maxReps) {
      return { type: 'up', text: 'Consider adding weight' };
    } else if (latestReps < minReps) {
      return { type: 'maintain', text: 'Focus on adding reps' };
    }
    return null;
  };

  const progressHint = getProgressHint();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-card border-t border-border rounded-t-3xl p-6 pb-8 safe-bottom animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl tracking-wide text-foreground">
              {exercise.name.toUpperCase()}
            </h2>
            {exercise.notes && (
              <p className="text-sm text-muted-foreground mt-1">{exercise.notes}</p>
            )}
            {progressHint && (
              <div className={`mt-2 inline-flex items-center gap-1 ${
                progressHint.type === 'up' ? 'progress-hint-up' : 'progress-hint-maintain'
              }`}>
                {progressHint.type === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
                {progressHint.text}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wide">
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
            <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wide">
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
            <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wide">
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

        {/* Comment Toggle */}
        {!showComment ? (
          <button
            onClick={() => setShowComment(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            + Add note
          </button>
        ) : (
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did it feel?"
              className="input-field w-full resize-none h-20"
              autoFocus
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {latestEntry && (
            <button
              onClick={handleSaveAsLast}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save as Last Time
            </button>
          )}
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 ${
              latestEntry ? 'btn-secondary' : 'btn-accent'
            }`}
          >
            {latestEntry ? 'Save with Changes' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
