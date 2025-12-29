import { useDiary } from '@/hooks/useDiary';
import { PasswordScreen } from '@/components/diary/PasswordScreen';
import { DiaryView } from '@/components/diary/DiaryView';

const Index = () => {
  const {
    entries,
    isUnlocked,
    hasPassword,
    isLoading,
    setPassword,
    unlock,
    lock,
    addEntry,
    updateEntry,
    deleteEntry,
    exportToJSON,
    importFromJSON,
  } = useDiary();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <PasswordScreen
        hasPassword={hasPassword}
        onSetPassword={setPassword}
        onUnlock={unlock}
      />
    );
  }

  return (
    <DiaryView
      entries={entries}
      onAdd={addEntry}
      onUpdate={updateEntry}
      onDelete={deleteEntry}
      onImport={importFromJSON}
      onLock={lock}
    />
  );
};

export default Index;