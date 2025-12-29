import { useState, useEffect, useCallback } from 'react';
import { DiaryEntry, DiaryData } from '@/types/diary';

const STORAGE_KEY = 'secret_diary_data';
const PASSWORD_KEY = 'secret_diary_password';
const UNLOCKED_KEY = 'secret_diary_unlocked';

// Simple hash function for password
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

export const useDiary = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if diary is already unlocked in this session
  useEffect(() => {
    const unlocked = sessionStorage.getItem(UNLOCKED_KEY) === 'true';
    const storedHash = sessionStorage.getItem(PASSWORD_KEY);
    
    setIsUnlocked(unlocked);
    setHasPassword(!!storedHash);
    
    if (unlocked) {
      loadEntries();
    }
    
    setIsLoading(false);
  }, []);

  const loadEntries = useCallback(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: DiaryEntry[] = JSON.parse(stored);
        setEntries(data);
      } catch {
        setEntries([]);
      }
    }
  }, []);

  const saveEntries = useCallback((newEntries: DiaryEntry[]) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    setEntries(newEntries);
  }, []);

  const setPassword = useCallback((password: string) => {
    const hash = hashPassword(password);
    sessionStorage.setItem(PASSWORD_KEY, hash);
    sessionStorage.setItem(UNLOCKED_KEY, 'true');
    setHasPassword(true);
    setIsUnlocked(true);
  }, []);

  const unlock = useCallback((password: string): boolean => {
    const storedHash = sessionStorage.getItem(PASSWORD_KEY);
    const inputHash = hashPassword(password);
    
    if (storedHash === inputHash) {
      sessionStorage.setItem(UNLOCKED_KEY, 'true');
      setIsUnlocked(true);
      loadEntries();
      return true;
    }
    return false;
  }, [loadEntries]);

  const lock = useCallback(() => {
    sessionStorage.removeItem(UNLOCKED_KEY);
    setIsUnlocked(false);
    setEntries([]);
  }, []);

  const addEntry = useCallback((date: string, title: string, content: string) => {
    const now = new Date().toISOString();
    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      date,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    
    const updated = [...entries, newEntry].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    saveEntries(updated);
    return newEntry;
  }, [entries, saveEntries]);

  const updateEntry = useCallback((id: string, title: string, content: string) => {
    const updated = entries.map(entry => 
      entry.id === id 
        ? { ...entry, title, content, updatedAt: new Date().toISOString() }
        : entry
    );
    saveEntries(updated);
  }, [entries, saveEntries]);

  const deleteEntry = useCallback((id: string) => {
    const updated = entries.filter(entry => entry.id !== id);
    saveEntries(updated);
  }, [entries, saveEntries]);

  const getEntryByDate = useCallback((date: string): DiaryEntry | undefined => {
    return entries.find(entry => entry.date === date);
  }, [entries]);

  const exportToJSON = useCallback((): string => {
    const passwordHash = sessionStorage.getItem(PASSWORD_KEY) || '';
    const data: DiaryData = {
      entries,
      passwordHash,
      createdAt: new Date().toISOString(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [entries]);

  const importFromJSON = useCallback((jsonString: string): boolean => {
    try {
      const data: DiaryData = JSON.parse(jsonString);
      
      if (!data.entries || !Array.isArray(data.entries)) {
        return false;
      }
      
      // Restore password if exists
      if (data.passwordHash) {
        sessionStorage.setItem(PASSWORD_KEY, data.passwordHash);
        setHasPassword(true);
      }
      
      // Restore entries
      saveEntries(data.entries);
      return true;
    } catch {
      return false;
    }
  }, [saveEntries]);

  return {
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
    getEntryByDate,
    exportToJSON,
    importFromJSON,
  };
};