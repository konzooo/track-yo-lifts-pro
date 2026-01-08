export interface WorkoutDay {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Exercise {
  id: string;
  workoutDayId: string;
  name: string;
  muscleTags: string[];
  isAnchor: boolean;
  defaultScheme: string;
  notes?: string;
  sortOrder: number;
}

export interface Entry {
  id: string;
  exerciseId: string;
  date: string;
  sets: number;
  repsText: string;
  weight: number;
  unit: 'kg' | 'lbs';
  comment?: string;
}

export interface AppData {
  workoutDays: WorkoutDay[];
  exercises: Exercise[];
  entries: Entry[];
  hasLoadedPreset: boolean;
}
