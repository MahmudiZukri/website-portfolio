"use client";

import { useState } from "react";
import { insforge } from "@/lib/insforge";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface SingleFileUploadProps {
  name?: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

export function SingleFileUpload({ name, value, onChange, accept = "application/pdf", label = "Upload File" }: SingleFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data, error } = await insforge.storage
        .from('portfolio-assets')
        .uploadAuto(file);

      if (error) throw error;
      if (data?.url) {
        onChange(data.url);
        toast.success("File uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {name && <input type="hidden" name={name} value={value} />}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="relative flex cursor-pointer items-center justify-center h-10 px-4 bg-card hover:bg-primary/20 text-card-foreground border-2 border-primary rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none transition-all font-medium text-sm w-max">
          {isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {isUploading ? "Uploading..." : label}
          <input 
            type="file" 
            accept={accept}
            className="hidden" 
            onChange={handleUpload} 
            disabled={isUploading}
          />
        </label>
        
        {value && (
          <div className="flex items-center gap-2">
            <a 
              href={value} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center h-10 px-4 bg-background hover:bg-primary/10 text-foreground border-2 border-primary rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none transition-all font-medium text-sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Current File
              <ExternalLink className="w-3 h-3 ml-2" />
            </a>
            
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => onChange("")}
              className="h-10 px-4 border-2 border-destructive rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
