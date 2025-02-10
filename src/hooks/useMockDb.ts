
import { useState, useEffect } from 'react';
import MockDatabase from '@/services/mockDb/MockDatabase';

export function useMockDb<T>(collection: string, query?: (item: T) => boolean) {
  const [data, setData] = useState<T[]>([]);
  const db = MockDatabase.getInstance();

  useEffect(() => {
    const loadData = () => {
      const result = query 
        ? db.query(collection as any, query)
        : db.getAll(collection as any);
      setData(result as T[]);
    };

    loadData();

    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mockDb') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [collection, query]);

  const create = (item: Omit<T, 'id'>) => {
    const result = db.create(collection as any, item);
    setData(prev => [...prev, result as T]);
    return result;
  };

  const update = (id: number, updates: Partial<T>) => {
    const result = db.update(collection as any, id, updates);
    if (result) {
      setData(prev => prev.map(item => 
        (item as any).id === id ? result : item
      ));
    }
    return result;
  };

  const remove = (id: number) => {
    const success = db.delete(collection as any, id);
    if (success) {
      setData(prev => prev.filter(item => (item as any).id !== id));
    }
    return success;
  };

  const getById = (id: number) => {
    return db.getById(collection as any, id);
  };

  return {
    data,
    create,
    update,
    remove,
    getById,
    reset: () => db.reset(),
    clear: () => db.clear(),
  };
}
