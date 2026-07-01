import { trpc } from "@/lib/trpc";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Check, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  onUploadComplete,
  accept = "image/*",
  maxSizeMB = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.media.uploadImage.useMutation({
    onSuccess: (data) => {
      setIsUploading(false);
      setUploadSuccess(true);
      onUploadComplete(data.url);
      setTimeout(() => {
        setUploadSuccess(false);
        setPreview(null);
      }, 2000);
    },
    onError: (error) => {
      setIsUploading(false);
      setError(error.message);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadSuccess(false);

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      // Convert file to base64
      const base64 = await fileToBase64(file);
      const base64Data = base64.split(',')[1]; // Remove data:image/...;base64, prefix

      uploadMutation.mutate({
        filename: file.name,
        contentType: file.type,
        base64Data
      });
    } catch (err) {
      setIsUploading(false);
      setError('Failed to read file');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleClearPreview = () => {
    setPreview(null);
    setError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            asChild
          >
            <span>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : uploadSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Uploaded!
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </>
              )}
            </span>
          </Button>
        </label>
        {preview && !uploadSuccess && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {preview && !uploadSuccess && (
        <div className="relative w-full max-w-md border rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        <ImageIcon className="h-4 w-4 inline mr-1" />
        Max file size: {maxSizeMB}MB • Supported formats: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
}
