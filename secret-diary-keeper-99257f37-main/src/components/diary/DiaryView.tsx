import { DiaryEntry } from '@/types/diary';
import { DiaryHeader } from './DiaryHeader';
import { NewEntryForm } from './NewEntryForm';
import { DiaryEntryCard } from './DiaryEntry';
import { BookOpen } from 'lucide-react';

interface DiaryViewProps {
  entries: DiaryEntry[];
  onAdd: (date: string, title: string, content: string) => void;
  onUpdate: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
  onImport: (json: string) => boolean;
  onLock: () => void;
}

export const DiaryView = ({
  entries,
  onAdd,
  onUpdate,
  onDelete,
  onImport,
  onLock,
}: DiaryViewProps) => {
  const existingDates = entries.map(e => e.date);

  return (
    <div className="min-h-screen bg-background">
      <DiaryHeader
        entries={entries}
        onImport={onImport}
        onLock={onLock}
        entryCount={entries.length}
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <NewEntryForm onAdd={onAdd} existingDates={existingDates} />

          {entries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-serif text-foreground mb-2">No entries yet</h2>
              <p className="text-muted-foreground text-sm">
                Start writing your first diary entry above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Your Entries
              </h2>
              {entries.map(entry => (
                <DiaryEntryCard
                  key={entry.id}
                  entry={entry}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <p className="text-center text-xs text-muted-foreground">
          Your diary is stored in session storage. Remember to export before closing the browser.
        </p>
      </footer>
    </div>
  );
};