import { AppData, Entry, WorkoutDay, Exercise } from './types';
import { presetWorkoutDays, presetExercises } from './presetData';

const STORAGE_KEY = 'anchor-progress-tracker';

const defaultData: AppData = {
  workoutDays: [],
  exercises: [],
  entries: [],
  hasLoadedPreset: false,
};

export function loadAppData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load app data:', e);
  }
  return defaultData;
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save app data:', e);
  }
}

export function loadPresetPlan(): AppData {
  const data: AppData = {
    workoutDays: presetWorkoutDays,
    exercises: presetExercises,
    entries: [],
    hasLoadedPreset: true,
  };
  saveAppData(data);
  return data;
}

export function addEntry(data: AppData, entry: Entry): AppData {
  const newData = {
    ...data,
    entries: [...data.entries, entry],
  };
  saveAppData(newData);
  return newData;
}

export function updateExercise(data: AppData, exercise: Exercise): AppData {
  const newData = {
    ...data,
    exercises: data.exercises.map((e) => (e.id === exercise.id ? exercise : e)),
  };
  saveAppData(newData);
  return newData;
}

export function deleteEntry(data: AppData, entryId: string): AppData {
  const newData = {
    ...data,
    entries: data.entries.filter((e) => e.id !== entryId),
  };
  saveAppData(newData);
  return newData;
}

export function getLatestEntry(entries: Entry[], exerciseId: string): Entry | null {
  const exerciseEntries = entries
    .filter(e => e.exerciseId === exerciseId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return exerciseEntries[0] || null;
}

export function getExerciseHistory(entries: Entry[], exerciseId: string): Entry[] {
  return entries
    .filter(e => e.exerciseId === exerciseId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
