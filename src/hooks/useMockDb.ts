
import { useState, useEffect } from 'react';
import MockDatabase from '@/services/mockDb/MockDatabase';

export function useMockDb<T>(collection: string, query?: (item: T) => boolean) {
  const [data, setData] = useState<T[]>([]);
  const db = MockDatabase.getInstance();

  useEffect(() => {
    const loadData = () => {
      console.log(`Loading data from collection: ${collection}`);
      const result = query 
        ? db.query(collection as any, query)
        : db.getAll(collection as any);
      console.log(`Data loaded from ${collection}:`, result);
      setData(result as T[]);
    };

    loadData();

    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mockDb') {
        console.log('MockDb storage changed, reloading data');
        loadData();
      }
    };

    // Dispatch a storage event to trigger reloads in other tabs/components
    const notifyStorageChange = () => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'mockDb'
      }));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [collection, query]);

  const create = (item: Omit<T, 'id'>) => {
    console.log(`Creating new item in ${collection}:`, item);
    const result = db.create(collection as any, item);
    console.log(`Created item result:`, result);
    
    // Update local state
    setData(prev => [...prev, result as T]);
    
    // Notify other components about the change
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'mockDb'
    }));
    
    return result;
  };

  const update = (id: number, updates: Partial<T>) => {
    console.log(`Updating item ${id} in ${collection}:`, updates);
    const result = db.update(collection as any, id, updates);
    if (result) {
      setData(prev => prev.map(item => 
        (item as any).id === id ? result : item
      ));
      // Notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'mockDb'
      }));
    }
    return result;
  };

  const remove = (id: number) => {
    console.log(`Removing item ${id} from ${collection}`);
    const success = db.delete(collection as any, id);
    if (success) {
      setData(prev => prev.filter(item => (item as any).id !== id));
      // Notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'mockDb'
      }));
    }
    return success;
  };

  const getById = (id: number) => {
    console.log(`Getting item ${id} from ${collection}`);
    return db.getById(collection as any, id);
  };

  const reset = () => {
    console.log(`Resetting ${collection} collection`);
    db.reset();
    // Notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'mockDb'
    }));
  };

  const clear = () => {
    console.log(`Clearing ${collection} collection`);
    db.clear();
    // Notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'mockDb'
    }));
  };

  return {
    data,
    create,
    update,
    remove,
    getById,
    reset,
    clear,
  };
}
