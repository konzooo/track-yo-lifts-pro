import { Anchor, ChevronRight } from 'lucide-react';
import { Exercise, Entry } from '@/lib/types';
import { getLatestEntry } from '@/lib/storage';
import { formatDistanceToNow } from 'date-fns';

interface ExerciseCardProps {
  exercise: Exercise;
  entries: Entry[];
  onClick: () => void;
}

export function ExerciseCard({ exercise, entries, onClick }: ExerciseCardProps) {
  const latestEntry = getLatestEntry(entries, exercise.id);
  
  const cardClass = exercise.isAnchor ? 'exercise-card-anchor' : 'exercise-card';

  return (
    <button
      onClick={onClick}
      className={`${cardClass} w-full text-left group active:scale-[0.98] transition-transform`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Exercise Name & Anchor Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground truncate">
              {exercise.name}
            </h4>
            {exercise.isAnchor && (
              <span className="anchor-badge flex items-center gap-1">
                <Anchor className="w-3 h-3" />
                Anchor
              </span>
            )}
          </div>

          {/* Last Performance or Default Scheme */}
          {latestEntry ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-2 text-lg">
                <span className="font-bold text-foreground">
                  {latestEntry.weight} {latestEntry.unit}
                </span>
                <span className="text-muted-foreground">
                  {latestEntry.sets} × {latestEntry.repsText}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(latestEntry.date), { addSuffix: true })}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">
                Target: {exercise.defaultScheme}
              </p>
              <p className="text-xs text-muted-foreground">
                No entries yet
              </p>
            </div>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground mt-1 group-hover:text-primary transition-colors flex-shrink-0" />
      </div>
    </button>
  );
}
