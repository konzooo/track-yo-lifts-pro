import { Dumbbell, Plus } from 'lucide-react';
import { WorkoutDay, Exercise, Entry } from '@/lib/types';
import { WorkoutDayCard } from './WorkoutDayCard';

interface WorkoutDayListProps {
  workoutDays: WorkoutDay[];
  exercises: Exercise[];
  entries: Entry[];
  onSelectDay: (day: WorkoutDay) => void;
  onAddWorkout: () => void;
}

export function WorkoutDayList({ workoutDays, exercises, entries, onSelectDay, onAddWorkout }: WorkoutDayListProps) {
  const sortedDays = [...workoutDays].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="min-h-screen bg-background p-4 safe-top safe-bottom">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pt-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-anchor-glow flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl tracking-wide text-foreground">
            WORKOUTS
          </h1>
        </div>

        {/* Workout Days */}
        <div className="space-y-3">
          {sortedDays.map((day) => (
            <WorkoutDayCard
              key={day.id}
              workoutDay={day}
              exercises={exercises.filter(e => e.workoutDayId === day.id)}
              entries={entries}
              onClick={() => onSelectDay(day)}
            />
          ))}
          
          {/* Add Workout Button */}
          <button
            onClick={onAddWorkout}
            className="w-full text-left group border-2 border-dashed border-border rounded-xl p-4 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">
                Add Workout
              </span>
            </div>
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Tap a workout to start logging
        </p>
      </div>
    </div>
  );
}
