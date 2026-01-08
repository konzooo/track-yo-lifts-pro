import { useState } from 'react';
import { ArrowLeft, Pencil, Plus, TrendingUp } from 'lucide-react';
import { Exercise, Entry } from '@/lib/types';
import { getExerciseHistory, getLatestEntry, generateId } from '@/lib/storage';
import { EditExerciseModal } from './EditExerciseModal';
import { format } from 'date-fns';

interface ExerciseDetailScreenProps {
  exercise: Exercise;
  entries: Entry[];
  onBack: () => void;
  onSaveEntry: (entry: Entry) => void;
  onUpdateExercise: (exercise: Exercise) => void;
  onDeleteEntry: (entryId: string) => void;
}

export function ExerciseDetailScreen({ 
  exercise, 
  entries, 
  onBack, 
  onSaveEntry,
  onUpdateExercise,
  onDeleteEntry 
}: ExerciseDetailScreenProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<{
    date: string;
    sets: number;
    repsText: string;
    weight: number;
    unit: 'kg' | 'lbs';
  } | null>(null);
  
  const history = getExerciseHistory(entries, exercise.id);
  const latestEntry = getLatestEntry(entries, exercise.id);

  const handleAddEntry = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setNewEntry({
      date: today,
      sets: latestEntry?.sets || 3,
      repsText: latestEntry?.repsText || '10',
      weight: latestEntry?.weight || 0,
      unit: latestEntry?.unit || 'kg',
    });
  };

  const handleSaveNewEntry = () => {
    if (!newEntry) return;
    
    const entry: Entry = {
      id: generateId(),
      exerciseId: exercise.id,
      date: new Date(newEntry.date).toISOString(),
      sets: newEntry.sets,
      repsText: newEntry.repsText,
      weight: newEntry.weight,
      unit: newEntry.unit,
    };
    onSaveEntry(entry);
    setNewEntry(null);
  };

  const handleCancelNewEntry = () => {
    setNewEntry(null);
  };

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit Info
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto p-4 pb-8">
        {/* Exercise Info Section */}
        <div className="mb-6">
          <h1 className="font-display text-3xl tracking-wide text-foreground mb-3">
            {exercise.name.toUpperCase()}
          </h1>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {exercise.isAnchor && (
              <span className="anchor-badge">
                Anchor
              </span>
            )}
            {exercise.muscleTags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Notes */}
          {exercise.notes && (
            <p className="text-sm text-muted-foreground mb-4 italic">
              {exercise.notes}
            </p>
          )}
          
          {/* Recent Performance Card */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Recent Performance
                </p>
                {latestEntry ? (
                  <p className="text-2xl font-semibold">
                    <span className="text-foreground">{latestEntry.sets}×{latestEntry.repsText}</span>
                    <span className="text-primary ml-2">{latestEntry.weight}{latestEntry.unit}</span>
                  </p>
                ) : (
                  <p className="text-lg text-muted-foreground">
                    {exercise.defaultScheme}
                  </p>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">History</h2>
            <button
              onClick={handleAddEntry}
              disabled={newEntry !== null}
              className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>

          {/* History Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-secondary/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <div>Date</div>
              <div className="text-center">Sets</div>
              <div className="text-center">Reps</div>
              <div className="text-right">Weight</div>
            </div>

            {/* New Entry Row */}
            {newEntry && (
              <div className="border-t border-border">
                <div className="grid grid-cols-4 gap-2 p-3 items-center bg-primary/5">
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="bg-secondary border border-border rounded px-2 py-1 text-sm text-foreground w-full"
                  />
                  <input
                    type="number"
                    value={newEntry.sets}
                    onChange={(e) => setNewEntry({ ...newEntry, sets: parseInt(e.target.value) || 0 })}
                    className="bg-secondary border border-border rounded px-2 py-1 text-sm text-foreground text-center w-full"
                    min={1}
                  />
                  <input
                    type="text"
                    value={newEntry.repsText}
                    onChange={(e) => setNewEntry({ ...newEntry, repsText: e.target.value })}
                    className="bg-secondary border border-border rounded px-2 py-1 text-sm text-foreground text-center w-full"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={newEntry.weight}
                      onChange={(e) => setNewEntry({ ...newEntry, weight: parseFloat(e.target.value) || 0 })}
                      className="bg-secondary border border-border rounded px-2 py-1 text-sm text-foreground text-right w-full"
                      min={0}
                      step={0.5}
                    />
                  </div>
                </div>
                <div className="flex gap-2 p-3 bg-primary/5 border-t border-border/50">
                  <button
                    onClick={handleCancelNewEntry}
                    className="flex-1 btn-secondary py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewEntry}
                    className="flex-1 btn-primary py-2 text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* History Rows */}
            {history.length === 0 && !newEntry ? (
              <div className="p-6 text-center text-muted-foreground">
                No entries yet. Add your first entry!
              </div>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-4 gap-2 p-3 border-t border-border items-center hover:bg-secondary/30 transition-colors"
                >
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(entry.date), 'd MMM')}
                  </div>
                  <div className="text-sm text-foreground text-center">
                    {entry.sets}
                  </div>
                  <div className="text-sm text-foreground text-center">
                    {entry.repsText}
                  </div>
                  <div className="text-sm text-foreground text-right">
                    <span className="text-primary font-medium">{entry.weight}</span>
                    <span className="text-muted-foreground ml-0.5">{entry.unit}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditExerciseModal
          exercise={exercise}
          onSave={(updatedExercise) => {
            onUpdateExercise(updatedExercise);
            setShowEditModal(false);
          }}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
