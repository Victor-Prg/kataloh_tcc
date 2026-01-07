import { useCallback, useState } from 'react';

export const useAsyncError = () => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  const throwAsyncError = useCallback((value: unknown) => {
    if (value instanceof Error) {
      setError(value);
      return;
    }

    if (typeof value === 'string') {
      setError(new Error(value));
      return;
    }

    setError(new Error('Erro desconhecido'));
  }, []);

  return throwAsyncError;
};

