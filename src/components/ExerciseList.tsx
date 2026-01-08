import { ArrowLeft, Anchor } from 'lucide-react';
import { WorkoutDay, Exercise, Entry } from '@/lib/types';
import { ExerciseCard } from './ExerciseCard';

interface ExerciseListProps {
  workoutDay: WorkoutDay;
  exercises: Exercise[];
  entries: Entry[];
  onBack: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export function ExerciseList({ workoutDay, exercises, entries, onBack, onSelectExercise }: ExerciseListProps) {
  const sortedExercises = [...exercises].sort((a, b) => a.sortOrder - b.sortOrder);
  const anchorExercises = sortedExercises.filter(e => e.isAnchor);
  const accessoryExercises = sortedExercises.filter(e => !e.isAnchor);

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-display text-2xl tracking-wide text-foreground truncate">
              {workoutDay.name.toUpperCase()}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto p-4 pb-8">
        {/* Anchor Exercises Section */}
        {anchorExercises.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Anchor className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
                Anchor Exercises
              </h2>
            </div>
            <div className="space-y-3">
              {anchorExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  entries={entries}
                  onClick={() => onSelectExercise(exercise)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Accessory Exercises Section */}
        {accessoryExercises.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Accessories
            </h2>
            <div className="space-y-3">
              {accessoryExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  entries={entries}
                  onClick={() => onSelectExercise(exercise)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
