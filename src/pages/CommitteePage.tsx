
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CommitteeList from '@/components/CommitteeList';
import CommitteeSearch from '@/components/committee/search/CommitteeSearch';
import CommitteeForm from '@/components/committee/CommitteeForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Committee } from '@/types/committee';

const CommitteePage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Show create form when route is /committee/create
  useEffect(() => {
    if (location.pathname === '/committee/create') {
      setShowCreateForm(true);
    }
  }, [location.pathname]);

  const handleCreateCommittee = (committee: Committee) => {
    toast({
      title: "Committee Created",
      description: `${committee.name} has been successfully created.`,
    });
    setShowCreateForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Committee Management</h1>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Create Committee
          </Button>
        </div>
        
        <CommitteeSearch />
        <div className="mt-8">
          <CommitteeList />
        </div>

        {/* Create Committee Modal */}
        {showCreateForm && (
          <CommitteeForm 
            onClose={() => setShowCreateForm(false)}
            onCreateCommittee={handleCreateCommittee}
          />
        )}
      </Card>
    </div>
  );
};

export default CommitteePage;
