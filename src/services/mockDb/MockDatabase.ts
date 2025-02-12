
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
    const savedData = localStorage.getItem('mockDb');
    if (savedData) {
      console.log('Loading data from localStorage:', savedData);
      this.data = JSON.parse(savedData);
    } else {
      console.log('Initializing with mock data');
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
    }
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private saveToStorage(): void {
    console.log('Saving data to localStorage:', this.data);
    localStorage.setItem('mockDb', JSON.stringify(this.data));
  }

  public getAll<K extends keyof Collections>(collection: K): Collections[K] {
    console.log(`Getting all items from ${collection}:`, this.data[collection]);
    return this.data[collection];
  }

  public getById<K extends keyof Collections>(
    collection: K,
    id: number
  ): Collections[K][number] | undefined {
    return this.data[collection].find((item) => item.id === id);
  }

  public create<K extends keyof Collections>(
    collection: K,
    item: Omit<Collections[K][number], 'id'>
  ): Collections[K][number] {
    console.log(`MockDatabase: Creating new item in ${collection}:`, item);
    const newId = Math.max(...this.data[collection].map((i) => i.id), 0) + 1;
    const newItem = { ...item, id: newId } as Collections[K][number];
    
    // Create a new array with the new item
    this.data[collection] = [...this.data[collection], newItem] as Collections[K];
    
    // Save to storage immediately
    this.saveToStorage();
    
    console.log(`MockDatabase: Updated ${collection} collection:`, this.data[collection]);
    return newItem;
  }

  public update<K extends keyof Collections>(
    collection: K,
    id: number,
    updates: Partial<Collections[K][number]>
  ): Collections[K][number] | undefined {
    const index = this.data[collection].findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    const updatedItem = {
      ...this.data[collection][index],
      ...updates,
    } as Collections[K][number];

    const updatedCollection = [...this.data[collection]];
    updatedCollection[index] = updatedItem;
    this.data[collection] = updatedCollection as Collections[K];
    this.saveToStorage();
    return updatedItem;
  }

  public delete<K extends keyof Collections>(
    collection: K,
    id: number
  ): boolean {
    const initialLength = this.data[collection].length;
    this.data[collection] = this.data[collection].filter((item) => item.id !== id) as Collections[K];
    const deleted = initialLength > this.data[collection].length;
    
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  public query<K extends keyof Collections>(
    collection: K,
    predicate: (item: Collections[K][number]) => boolean
  ): Collections[K] {
    return this.data[collection].filter(predicate) as Collections[K];
  }

  public clear(): void {
    localStorage.removeItem('mockDb');
    this.data = {
      tenders: [],
      vendors: [],
      bidSecurities: [],
      documentFees: [],
      preBidMeetings: [],
      clarifications: [],
      committees: [],
      employees: [],
    };
  }

  public reset(): void {
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
  }
}

export default MockDatabase;
