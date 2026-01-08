import { useState, useEffect } from 'react';
import { AppData, WorkoutDay, Exercise, Entry } from '@/lib/types';
import { loadAppData, loadPresetPlan, addEntry, updateExercise, deleteEntry } from '@/lib/storage';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { WorkoutDayList } from '@/components/WorkoutDayList';
import { ExerciseList } from '@/components/ExerciseList';
import { ExerciseDetailScreen } from '@/components/ExerciseDetailScreen';

type View = 'welcome' | 'workouts' | 'exercises' | 'exerciseDetail';

const Index = () => {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [view, setView] = useState<View>('welcome');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const data = loadAppData();
    setAppData(data);
    
    if (data.hasLoadedPreset && data.workoutDays.length > 0) {
      setView('workouts');
    }
  }, []);

  const handleLoadPreset = () => {
    const data = loadPresetPlan();
    setAppData(data);
    setView('workouts');
  };

  const handleSelectDay = (day: WorkoutDay) => {
    setSelectedDay(day);
    setView('exercises');
  };

  const handleBackToWorkouts = () => {
    setSelectedDay(null);
    setView('workouts');
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setView('exerciseDetail');
  };

  const handleBackToExercises = () => {
    setSelectedExercise(null);
    setView('exercises');
  };

  const handleSaveEntry = (entry: Entry) => {
    if (!appData) return;
    const updatedData = addEntry(appData, entry);
    setAppData(updatedData);
  };

  const handleUpdateExercise = (exercise: Exercise) => {
    if (!appData) return;
    const updatedData = updateExercise(appData, exercise);
    setAppData(updatedData);
    setSelectedExercise(exercise);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (!appData) return;
    const updatedData = deleteEntry(appData, entryId);
    setAppData(updatedData);
  };

  if (!appData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (view === 'welcome') {
    return <WelcomeScreen onLoadPreset={handleLoadPreset} />;
  }

  if (view === 'exerciseDetail' && selectedExercise) {
    return (
      <ExerciseDetailScreen
        exercise={selectedExercise}
        entries={appData.entries}
        onBack={handleBackToExercises}
        onSaveEntry={handleSaveEntry}
        onUpdateExercise={handleUpdateExercise}
        onDeleteEntry={handleDeleteEntry}
      />
    );
  }

  if (view === 'exercises' && selectedDay) {
    const dayExercises = appData.exercises.filter(e => e.workoutDayId === selectedDay.id);
    return (
      <ExerciseList
        workoutDay={selectedDay}
        exercises={dayExercises}
        entries={appData.entries}
        onBack={handleBackToWorkouts}
        onSelectExercise={handleSelectExercise}
      />
    );
  }

  return (
    <WorkoutDayList
      workoutDays={appData.workoutDays}
      exercises={appData.exercises}
      entries={appData.entries}
      onSelectDay={handleSelectDay}
    />
  );
};

export default Index;
