
import { useState } from "react";
import { useMockDb } from "@/hooks/useMockDb";
import { Committee } from "@/types/committee";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, Calendar } from "lucide-react";

const CommitteeSearch = () => {
  const { data: committees } = useMockDb<Committee>("committees");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  const departments = Array.from(
    new Set(
      committees.flatMap((committee) =>
        committee.members.map((member) => member.department)
      )
    )
  );

  const filteredCommittees = committees.filter((committee) => {
    const matchesSearch = committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      committee.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || committee.approvalStatus === statusFilter;
    const matchesDepartment = !departmentFilter ||
      committee.members.some((member) => member.department === departmentFilter);
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search committees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <Users className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCommittees.map((committee) => (
          <Card key={committee.id} className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{committee.name}</h3>
                <Badge variant={committee.approvalStatus === "approved" ? "default" : "secondary"}>
                  {committee.approvalStatus}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{committee.purpose}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Formed: {new Date(committee.formationDate).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {committee.members.map((member) => (
                  <Badge key={member.id} variant="outline">
                    {member.name} ({member.department})
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
        {filteredCommittees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No committees found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeSearch;
