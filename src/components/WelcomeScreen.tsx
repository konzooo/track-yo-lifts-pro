import { Dumbbell, Zap, Target } from 'lucide-react';

interface WelcomeScreenProps {
  onLoadPreset: () => void;
}

export function WelcomeScreen({ onLoadPreset }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 safe-bottom">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-anchor-glow flex items-center justify-center">
            <Dumbbell className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-5xl tracking-wide text-foreground">
            ANCHOR
          </h1>
          <p className="text-muted-foreground text-lg">
            Track what matters. Progress consistently.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 text-foreground">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Anchor Exercises</p>
              <p className="text-sm text-muted-foreground">Focus on key movements for progressive overload</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-foreground">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-medium">Quick Logging</p>
              <p className="text-sm text-muted-foreground">One-tap to confirm your last performance</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onLoadPreset}
          className="w-full btn-accent text-lg py-4 rounded-2xl shadow-lg shadow-accent/25"
        >
          Load Preset Plan
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Start with a proven 3-day split
        </p>
      </div>
    </div>
  );
}
