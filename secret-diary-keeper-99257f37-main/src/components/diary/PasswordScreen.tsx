import { useState } from 'react';
import { Lock, Key, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PasswordScreenProps {
  hasPassword: boolean;
  onSetPassword: (password: string) => void;
  onUnlock: (password: string) => boolean;
}

export const PasswordScreen = ({ hasPassword, onSetPassword, onUnlock }: PasswordScreenProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hasPassword) {
      // Setting new password
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      onSetPassword(password);
    } else {
      // Unlocking
      const success = onUnlock(password);
      if (!success) {
        setError('Incorrect password');
        setPassword('');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center glow-sm">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif tracking-wide">
            {hasPassword ? 'Welcome Back' : 'Create Your Secret Diary'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {hasPassword 
              ? 'Enter your password to unlock your diary'
              : 'Set a password to protect your private thoughts'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={hasPassword ? 'Enter password' : 'Create password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-input border-border focus:border-primary focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {!hasPassword && (
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary focus:ring-primary"
                />
              </div>
            )}

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <Button type="submit" className="w-full glow">
              {hasPassword ? 'Unlock Diary' : 'Create Diary'}
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Your diary is stored in session storage. Use JSON export to backup your entries.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};