"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { deleteMemberAction } from "@/actions/membership-actions";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteMemberButtonProps {
  profileId: string;
  memberId: string;
  memberName: string;
  variant?: "icon" | "button" | "menu-item";
  redirectAfterDelete?: boolean;
}

export function DeleteMemberButton({
  profileId,
  memberId,
  memberName,
  variant = "icon",
  redirectAfterDelete = false,
}: DeleteMemberButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMemberAction(profileId);
      if (result.success) {
        toast.success(`Member ${memberId} has been permanently deleted.`);
        setIsOpen(false);
        if (redirectAfterDelete) {
          router.push("/admin/members");
        }
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete member.");
      }
    } catch (err: any) {
      toast.error("An error occurred while deleting the member.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <button
            type="button"
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors"
            title="Delete Member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : variant === "button" ? (
          <Button
            variant="outline"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-400 border-red-200 dark:border-red-900/50"
          >
            <Trash2 className="w-4 h-4" /> Delete Member
          </Button>
        ) : (
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete Member
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto sm:mx-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Delete Member Account
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm">
            Are you sure you want to permanently delete member <strong className="text-slate-900 dark:text-white">{memberName}</strong> (<code className="font-mono text-xs text-primary">{memberId}</code>)?
            <br /><br />
            This will remove their profile, authentication user record, sessions, and access permanently. This action <strong>cannot be undone</strong>.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Member"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
