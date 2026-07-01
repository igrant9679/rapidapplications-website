import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface DragDropUploadProps {
  onUploadComplete?: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

export default function DragDropUpload({ onUploadComplete }: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const uploadMutation = trpc.media.uploadImage.useMutation();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File, index: number) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadingFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: "error", error: "Only image files are allowed" }
            : f
        )
      );
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadingFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: "error", error: "File size must be under 10MB" }
            : f
        )
      );
      return;
    }

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const base64Content = base64Data.split(",")[1];

        // Get image dimensions
        const img = new Image();
        img.src = base64Data;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Simulate progress
        setUploadingFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, progress: 50 } : f))
        );

        // Upload to server
        await uploadMutation.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64Data: base64Content,
          width: img.width,
          height: img.height,
        });

        // Mark as complete
        setUploadingFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, progress: 100, status: "success" } : f
          )
        );

        // Call callback after a short delay
        setTimeout(() => {
          onUploadComplete?.();
        }, 500);
      };

      reader.onerror = () => {
        setUploadingFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? { ...f, status: "error", error: "Failed to read file" }
              : f
          )
        );
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setUploadingFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      // Initialize uploading files
      const newUploadingFiles: UploadingFile[] = files.map((file) => ({
        file,
        progress: 0,
        status: "uploading",
      }));

      setUploadingFiles(newUploadingFiles);

      // Process each file
      for (let i = 0; i < files.length; i++) {
        await processFile(files[i], i);
      }
    },
    [uploadMutation]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // Initialize uploading files
      const newUploadingFiles: UploadingFile[] = files.map((file) => ({
        file,
        progress: 0,
        status: "uploading",
      }));

      setUploadingFiles(newUploadingFiles);

      // Process each file
      for (let i = 0; i < files.length; i++) {
        await processFile(files[i], i);
      }

      // Reset input
      e.target.value = "";
    },
    [uploadMutation]
  );

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
          <Upload
            className={`h-12 w-12 mb-4 ${
              isDragging ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <p className="text-sm font-medium mb-1">
            {isDragging ? "Drop images here" : "Drag and drop images here"}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            or click to browse (max 10MB per file)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </Card>

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadFile, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {uploadFile.status === "uploading" && (
                    <Upload className="h-5 w-5 text-primary animate-pulse" />
                  )}
                  {uploadFile.status === "success" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {uploadFile.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadFile.file.name}
                  </p>
                  {uploadFile.status === "uploading" && (
                    <Progress value={uploadFile.progress} className="h-1 mt-2" />
                  )}
                  {uploadFile.status === "error" && (
                    <p className="text-xs text-destructive mt-1">
                      {uploadFile.error}
                    </p>
                  )}
                  {uploadFile.status === "success" && (
                    <p className="text-xs text-green-600 mt-1">
                      Upload complete
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 hover:opacity-70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
