"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { approveNewsArticle, deleteNewsArticle } from "@/actions/admin/news";
import { useRouter } from "next/navigation";

export default function NewsActionButtons({ 
  articleId, 
  status, 
  canApprove,
  canDelete
}: { 
  articleId: string;
  status: string;
  canApprove: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();

  const handleApprove = async () => {
    try {
      await approveNewsArticle(articleId);
      toast.success("Article published successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to approve");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    try {
      await deleteNewsArticle(articleId);
      toast.success("Article deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {status === "PENDING_APPROVAL" && canApprove && (
        <Button onClick={handleApprove} variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50">
          <CheckCircle className="w-4 h-4" />
        </Button>
      )}
      
      {status === "PENDING_APPROVAL" && !canApprove && (
        <Button variant="ghost" size="icon" disabled className="h-8 w-8 text-orange-400">
          <Clock className="w-4 h-4" />
        </Button>
      )}

      {/* Everyone who can see it can theoretically edit it if they are the author. 
          For simplicity in this component, we just route to edit. 
          The real security blocks happen in the server action if they try to save. */}
      <Button onClick={() => router.push(`/admin/news/edit/${articleId}`)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600">
        <Edit className="w-4 h-4" />
      </Button>

      {canDelete && (
        <Button onClick={handleDelete} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
