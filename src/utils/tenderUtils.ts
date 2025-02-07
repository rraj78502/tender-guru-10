
import { Badge } from "@/components/ui/badge";
import { TenderStatus } from "@/types/tender";

export const getStatusBadge = (status: TenderStatus) => {
  const statusStyles = {
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {status}
    </Badge>
  );
};
