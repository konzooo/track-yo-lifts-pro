import { ChevronRight, Anchor } from 'lucide-react';
import { WorkoutDay, Exercise, Entry } from '@/lib/types';
import { getLatestEntry } from '@/lib/storage';

interface WorkoutDayCardProps {
  workoutDay: WorkoutDay;
  exercises: Exercise[];
  entries: Entry[];
  onClick: () => void;
}

export function WorkoutDayCard({ workoutDay, exercises, entries, onClick }: WorkoutDayCardProps) {
  const anchorCount = exercises.filter(e => e.isAnchor).length;
  const totalExercises = exercises.length;
  
  // Check if any exercise has been logged today
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = exercises.filter(ex => {
    const latest = getLatestEntry(entries, ex.id);
    return latest && latest.date.startsWith(today);
  });
  const hasLoggedToday = todayEntries.length > 0;

  return (
    <button
      onClick={onClick}
      className="workout-day-card w-full text-left group"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-2xl tracking-wide text-foreground group-hover:text-primary transition-colors">
            {workoutDay.name.toUpperCase()}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{totalExercises} exercises</span>
            {anchorCount > 0 && (
              <span className="flex items-center gap-1 text-primary">
                <Anchor className="w-3 h-3" />
                {anchorCount} anchors
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {hasLoggedToday && (
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          )}
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </button>
  );
}
