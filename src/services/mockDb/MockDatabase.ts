
import { Tender } from "@/types/tender";
import { Vendor } from "@/types/vendor";
import { BidSecurity, DocumentFee, PreBidMeeting, Clarification } from "@/types/procurement";
import { Committee } from "@/types/committee";
import { Employee } from "@/types/employee";
import { mockTenders } from "@/mock/tenderData";
import { mockBidSecurities, mockDocumentFees, mockPreBidMeetings, mockClarifications } from "@/mock/procurementData";
import { mockVendors } from "@/utils/vendorUtils";
import { mockCommittees } from "@/mock/committeeData";
import { mockEmployees } from "@/mock/employeeData";

type Collections = {
  tenders: Tender[];
  vendors: Vendor[];
  bidSecurities: BidSecurity[];
  documentFees: DocumentFee[];
  preBidMeetings: PreBidMeeting[];
  clarifications: Clarification[];
  committees: Committee[];
  employees: Employee[];
};

class MockDatabase {
  private static instance: MockDatabase;
  private data: Collections;

  private constructor() {
    console.log('MockDatabase constructor called');
    const savedData = localStorage.getItem('mockDb');
    if (savedData) {
      try {
        console.log('Found existing data in localStorage');
        this.data = JSON.parse(savedData);
        console.log('Successfully loaded data:', this.data);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        this.initializeWithMockData();
      }
    } else {
      console.log('No existing data found, initializing with mock data');
      this.initializeWithMockData();
    }
  }

  private initializeWithMockData() {
    console.log('Initializing database with mock data');
    this.data = {
      tenders: mockTenders,
      vendors: mockVendors,
      bidSecurities: mockBidSecurities,
      documentFees: mockDocumentFees,
      preBidMeetings: mockPreBidMeetings,
      clarifications: mockClarifications,
      committees: mockCommittees,
      employees: mockEmployees,
    };
    this.saveToStorage();
    console.log('Mock data initialized:', this.data);
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      console.log('Creating new MockDatabase instance');
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private saveToStorage(): void {
    try {
      console.log('Saving data to localStorage:', this.data);
      localStorage.setItem('mockDb', JSON.stringify(this.data));
      console.log('Data successfully saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  public getAll<K extends keyof Collections>(collection: K): Collections[K] {
    console.log(`Getting all items from ${collection}:`, this.data[collection]);
    return [...this.data[collection]]; // Return a copy to prevent direct mutations
  }

  public getById<K extends keyof Collections>(
    collection: K,
    id: number
  ): Collections[K][number] | undefined {
    console.log(`Getting item ${id} from ${collection}`);
    const item = this.data[collection].find((item) => item.id === id);
    console.log('Found item:', item);
    return item;
  }

  public create<K extends keyof Collections>(
    collection: K,
    item: Omit<Collections[K][number], 'id'>
  ): Collections[K][number] {
    console.log(`Creating new item in ${collection}:`, item);
    
    // Generate new ID
    const newId = Math.max(...this.data[collection].map((i) => i.id), 0) + 1;
    console.log('Generated new ID:', newId);
    
    // Create new item with ID
    const newItem = { ...item, id: newId } as Collections[K][number];
    console.log('Created new item:', newItem);
    
    // Update collection with new item
    this.data[collection] = [...this.data[collection], newItem] as Collections[K];
    console.log(`Updated ${collection} collection:`, this.data[collection]);
    
    // Save changes to storage
    this.saveToStorage();
    
    return newItem;
  }

  public update<K extends keyof Collections>(
    collection: K,
    id: number,
    updates: Partial<Collections[K][number]>
  ): Collections[K][number] | undefined {
    console.log(`Updating item ${id} in ${collection} with:`, updates);
    const index = this.data[collection].findIndex((item) => item.id === id);
    
    if (index === -1) {
      console.log('Item not found for update');
      return undefined;
    }

    const updatedItem = {
      ...this.data[collection][index],
      ...updates,
    } as Collections[K][number];

    const updatedCollection = [...this.data[collection]];
    updatedCollection[index] = updatedItem;
    this.data[collection] = updatedCollection as Collections[K];
    
    this.saveToStorage();
    console.log('Update successful:', updatedItem);
    
    return updatedItem;
  }

  public delete<K extends keyof Collections>(
    collection: K,
    id: number
  ): boolean {
    console.log(`Attempting to delete item ${id} from ${collection}`);
    const initialLength = this.data[collection].length;
    this.data[collection] = this.data[collection].filter((item) => item.id !== id) as Collections[K];
    const deleted = initialLength > this.data[collection].length;
    
    if (deleted) {
      console.log('Item successfully deleted');
      this.saveToStorage();
    } else {
      console.log('Item not found for deletion');
    }
    
    return deleted;
  }

  public query<K extends keyof Collections>(
    collection: K,
    predicate: (item: Collections[K][number]) => boolean
  ): Collections[K] {
    console.log(`Querying ${collection} with predicate`);
    const results = this.data[collection].filter(predicate) as Collections[K];
    console.log('Query results:', results);
    return results;
  }

  public clear(): void {
    console.log('Clearing all data');
    localStorage.removeItem('mockDb');
    this.initializeWithMockData();
  }

  public reset(): void {
    console.log('Resetting to initial mock data');
    this.initializeWithMockData();
  }
}

export default MockDatabase;
