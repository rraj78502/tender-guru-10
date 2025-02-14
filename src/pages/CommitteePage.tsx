
import React from 'react';
import CommitteeList from '@/components/CommitteeList';
import CommitteeSearch from '@/components/committee/search/CommitteeSearch';
import { Card } from '@/components/ui/card';

const CommitteePage = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Committee Management</h1>
        <CommitteeSearch />
        <div className="mt-8">
          <CommitteeList />
        </div>
      </Card>
    </div>
  );
};

export default CommitteePage;
