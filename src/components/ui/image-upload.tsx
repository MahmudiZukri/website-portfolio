"use client";

import { useState } from "react";
import { insforge } from "@/lib/insforge";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface SingleImageUploadProps {
  name?: string;
  value: string;
  onChange: (url: string) => void;
}

export function SingleImageUpload({ name, value, onChange }: SingleImageUploadProps) {
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
        toast.success("Image uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {name && <input type="hidden" name={name} value={value} />}
      <div className="flex items-center gap-4">
        <label className="relative flex cursor-pointer items-center justify-center h-10 px-4 bg-card hover:bg-primary/20 text-card-foreground border-2 border-primary rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none transition-all font-medium text-sm">
          {isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {isUploading ? "Uploading..." : "Upload Image"}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleUpload} 
            disabled={isUploading}
          />
        </label>
        {value && (
          <Button 
            type="button" 
            variant="destructive" 
            size="sm" 
            onClick={() => onChange("")}
            className="border-2 border-destructive rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none"
          >
            Clear
          </Button>
        )}
      </div>
      {value && (
        <div className="relative w-full max-w-sm border-2 border-primary shadow-[4px_4px_0_0_#000]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded preview" className="w-full h-auto object-cover" />
        </div>
      )}
    </div>
  );
}

interface MultiImageUploadProps {
  name?: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

export function MultiImageUpload({ name, value, onChange }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newUrls: string[] = [];
      
      // Upload all selected files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { data, error } = await insforge.storage
          .from('portfolio-assets')
          .uploadAuto(file);

        if (error) throw error;
        if (data?.url) {
          newUrls.push(data.url);
        }
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
        toast.success(`Successfully uploaded ${newUrls.length} image(s)!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newValues = [...value];
    newValues.splice(indexToRemove, 1);
    onChange(newValues);
  };

  return (
    <div className="space-y-4">
      {name && <input type="hidden" name={name} value={value.join(",")} />}
      <label className="relative inline-flex cursor-pointer items-center justify-center h-10 px-4 bg-card hover:bg-primary/20 text-card-foreground border-2 border-primary rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none transition-all font-medium text-sm">
        {isUploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 mr-2" />
        )}
        {isUploading ? "Uploading..." : "Upload Multiple Images"}
        <input 
          type="file" 
          accept="image/*" 
          multiple
          className="hidden" 
          onChange={handleUpload} 
          disabled={isUploading}
        />
      </label>
      
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {value.map((url, index) => (
            <div key={index} className="relative group border-2 border-primary shadow-[4px_4px_0_0_#000]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Gallery ${index}`} className="w-full aspect-square object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity active:translate-y-px"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
