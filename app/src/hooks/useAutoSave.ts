'use client';

import { useEffect, useRef, useCallback } from 'react';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface UseAutoSaveOptions {
  onSave: (content: string) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoSave({
  onSave,
  debounceMs = 1000,
  enabled = true
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>('');
  const statusRef = useRef<SaveStatus>('saved');
  const isFirstRender = useRef(true);

  const save = useCallback(async (content: string) => {
    if (!enabled || content === lastContentRef.current) {
      return;
    }

    try {
      statusRef.current = 'saving';
      await onSave(content);
      lastContentRef.current = content;
      statusRef.current = 'saved';
    } catch (error) {
      console.error('Auto-save failed:', error);
      statusRef.current = 'error';
    }
  }, [onSave, enabled]);

  const debouncedSave = useCallback((content: string) => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Skip auto-save on first render to avoid saving initial content
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastContentRef.current = content;
      return;
    }

    // Mark as unsaved immediately
    if (content !== lastContentRef.current) {
      statusRef.current = 'unsaved';
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save(content);
    }, debounceMs);
  }, [save, debounceMs, enabled]);

  const forceSave = useCallback(async (content: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    await save(content);
  }, [save]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    debouncedSave,
    forceSave,
    getStatus: () => statusRef.current
  };
}
