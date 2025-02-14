
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommitteeList from '@/components/CommitteeList';
import CommitteeSearch from '@/components/committee/search/CommitteeSearch';
import CommitteeForm from '@/components/committee/CommitteeForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Committee } from '@/types/committee';

const CommitteePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCreateRoute = location.pathname === '/committee/create';

  const handleCreateCommittee = (committee: Committee) => {
    toast({
      title: "Committee Created",
      description: `${committee.name} has been successfully created.`,
    });
    navigate('/committee');
  };

  if (isCreateRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
          <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 shadow-lg">
            <CommitteeForm 
              onClose={() => navigate('/committee')}
              onCreateCommittee={handleCreateCommittee}
            />
          </Card>
        </div>
      </div>
    );
  }

  const handleCreateClick = () => {
    navigate('/committee/create');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <Card className="p-4 sm:p-6 lg:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">Committee Management</h1>
            <Button 
              onClick={handleCreateClick}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              Create Committee
            </Button>
          </div>
          
          <CommitteeSearch />
          <div className="mt-8">
            <CommitteeList />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommitteePage;
