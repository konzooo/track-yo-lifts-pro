import { useState, useEffect } from 'react';
import { AppData, WorkoutDay, Exercise, Entry } from '@/lib/types';
import { loadAppData, loadPresetPlan, addEntry, updateEntry, updateExercise, deleteEntry, addWorkoutDay, addExercise } from '@/lib/storage';
import { WorkoutDayList } from '@/components/WorkoutDayList';
import { ExerciseList } from '@/components/ExerciseList';
import { ExerciseDetailScreen } from '@/components/ExerciseDetailScreen';
import { AddWorkoutModal } from '@/components/AddWorkoutModal';
import { EditExerciseModal } from '@/components/EditExerciseModal';

type View = 'workouts' | 'exercises' | 'exerciseDetail';

const Index = () => {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [view, setView] = useState<View>('workouts');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState<{ isOpen: boolean; exercise: Exercise | null; workoutDayId?: string }>({ isOpen: false, exercise: null });

  useEffect(() => {
    let data = loadAppData();
    
    // Auto-load preset if not already loaded
    if (!data.hasLoadedPreset || data.workoutDays.length === 0) {
      data = loadPresetPlan();
    }
    
    setAppData(data);
  }, []);

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

  const handleUpdateEntry = (entry: Entry) => {
    if (!appData) return;
    const updatedData = updateEntry(appData, entry);
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

  const handleAddWorkout = (name: string) => {
    if (!appData) return;
    const updatedData = addWorkoutDay(appData, name);
    setAppData(updatedData);
    setShowAddWorkoutModal(false);
  };

  const handleAddExercise = () => {
    if (!selectedDay) return;
    setShowExerciseModal({ isOpen: true, exercise: null, workoutDayId: selectedDay.id });
  };

  const handleSaveExercise = (exercise: Exercise) => {
    if (!appData) return;
    let updatedData: AppData;
    
    if (exercise.id && appData.exercises.some(e => e.id === exercise.id)) {
      // Update existing exercise
      updatedData = updateExercise(appData, exercise);
      setSelectedExercise(exercise);
    } else {
      // Add new exercise
      updatedData = addExercise(appData, exercise);
    }
    
    setAppData(updatedData);
    setShowExerciseModal({ isOpen: false, exercise: null });
  };

  if (!appData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (view === 'exerciseDetail' && selectedExercise) {
    return (
      <ExerciseDetailScreen
        exercise={selectedExercise}
        entries={appData.entries}
        onBack={handleBackToExercises}
        onSaveEntry={handleSaveEntry}
        onUpdateEntry={handleUpdateEntry}
        onUpdateExercise={handleUpdateExercise}
        onDeleteEntry={handleDeleteEntry}
      />
    );
  }

  if (view === 'exercises' && selectedDay) {
    const dayExercises = appData.exercises.filter(e => e.workoutDayId === selectedDay.id);
    return (
      <>
        <ExerciseList
          workoutDay={selectedDay}
          exercises={dayExercises}
          entries={appData.entries}
          onBack={handleBackToWorkouts}
          onSelectExercise={handleSelectExercise}
          onAddExercise={handleAddExercise}
        />
        {showExerciseModal.isOpen && (
          <EditExerciseModal
            exercise={showExerciseModal.exercise}
            workoutDayId={showExerciseModal.workoutDayId}
            onSave={handleSaveExercise}
            onClose={() => setShowExerciseModal({ isOpen: false, exercise: null })}
          />
        )}
      </>
    );
  }

  return (
    <>
      <WorkoutDayList
        workoutDays={appData.workoutDays}
        exercises={appData.exercises}
        entries={appData.entries}
        onSelectDay={handleSelectDay}
        onAddWorkout={() => setShowAddWorkoutModal(true)}
      />
      {showAddWorkoutModal && (
        <AddWorkoutModal
          onSave={handleAddWorkout}
          onClose={() => setShowAddWorkoutModal(false)}
        />
      )}
    </>
  );
};

export default Index;
