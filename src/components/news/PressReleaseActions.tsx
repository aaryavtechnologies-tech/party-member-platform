"use client";

import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { incrementNewsPrint, incrementNewsDownload } from "@/actions/public/news";

interface PrintButtonProps {
  articleId: string;
}

export function PrintReleaseButton({ articleId }: PrintButtonProps) {
  const handlePrint = async () => {
    // Increment the print counter
    incrementNewsPrint(articleId).catch(() => {});
    // Trigger browser print
    window.print();
  };

  return (
    <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handlePrint}>
      <Printer className="w-4 h-4 mr-2" /> Print Release
    </Button>
  );
}

interface DocumentDownloadLinkProps {
  articleId: string;
  document: any;
}

export function DocumentDownloadLink({ articleId, document }: DocumentDownloadLinkProps) {
  const handleDownload = () => {
    incrementNewsDownload(articleId).catch(() => {});
  };

  return (
    <a 
      href={document.media.url} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleDownload}
      className="flex flex-col p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors group"
    >
      <span className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
        {document.caption || document.media.filename}
      </span>
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {document.media.mimeType.includes("pdf") ? "PDF Document" : "Document"} • {(document.media.size / 1024 / 1024).toFixed(2)} MB
      </span>
    </a>
  );
}
