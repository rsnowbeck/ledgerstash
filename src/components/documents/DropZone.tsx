import { useState, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  onFiles: (files: FileList) => void;
  uploading?: boolean;
  compact?: boolean;
}

export function DropZone({ onFiles, uploading = false, compact = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  }, [onFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl text-center transition-all ${
        compact ? "p-4" : "p-8"
      } ${
        isDragging
          ? "border-accent bg-accent/5 scale-[1.01]"
          : "border-border hover:border-accent/40"
      }`}
    >
      <Upload className={`mx-auto mb-2 ${compact ? "h-6 w-6" : "h-10 w-10"} ${isDragging ? "text-accent" : "text-muted-foreground"}`} />
      <p className={`text-foreground font-medium ${compact ? "text-sm mb-1" : "mb-1"}`}>
        {uploading ? "Uploading..." : isDragging ? "Drop files here" : "Drag & drop files here"}
      </p>
      {!compact && <p className="text-sm text-muted-foreground mb-4">or click to browse</p>}
      <label className="cursor-pointer">
        <input type="file" multiple className="hidden" onChange={handleChange} disabled={uploading} />
        <Button variant="outline" size="sm" asChild disabled={uploading}>
          <span>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Choose Files"}
          </span>
        </Button>
      </label>
    </div>
  );
}
