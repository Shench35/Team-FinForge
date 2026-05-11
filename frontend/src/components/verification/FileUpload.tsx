import { useState, useCallback } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "../../ui/Button";
import { Alert } from "../../ui/Alert";
import { PLAN_LIMITS } from "../../utils/constants";
import { formatFileSize, truncateFilename } from "../../utils/formatters";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
}

interface FileUploadProps {
  planType: "PRO" | "PRO_MAX" | "ENTERPRISE";
  onFilesSelected: (files: File[]) => void;
  onContinue?: () => void;
  maxFiles?: number;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const validateFile = (file: File): string | null => {
  const fileName = file.name.toLowerCase();
  const hasValidExtension = [".pdf", ".png", ".jpg", ".jpeg"].some((ext) =>
    fileName.endsWith(ext),
  );

  if (!ACCEPTED_TYPES.includes(file.type) && !hasValidExtension) {
    return "Only PDF, PNG, and JPG files are accepted.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File size cannot exceed 10MB. Your file is ${formatFileSize(file.size)}.`;
  }
  return null;
};

export const FileUpload = ({
  planType,
  onFilesSelected,
  onContinue,
  maxFiles,
}: FileUploadProps) => {
  const limit = maxFiles || PLAN_LIMITS[planType];
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasReachedLimit = uploadedFiles.length >= limit;

  const handleAddFiles = useCallback(
    (files: FileList) => {
      setError(null);

      const newFiles: UploadedFile[] = [];
      let errorMsg: string | null = null;

      for (let i = 0; i < files.length; i++) {
        if (uploadedFiles.length + newFiles.length >= limit) {
          errorMsg = `Maximum ${limit} files allowed for your ${planType} plan.`;
          break;
        }

        const file = files[i];
        const validation = validateFile(file);
        if (validation) {
          errorMsg = validation;
          break;
        }

        newFiles.push({
          id: `${Date.now()}-${i}`,
          file,
          progress: 100,
        });
      }

      if (errorMsg) {
        setError(errorMsg);
        return;
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesSelected(updatedFiles.map((f) => f.file));
    },
    [uploadedFiles, limit, planType, onFilesSelected],
  );

  const handleDelete = (id: string) => {
    const updatedFiles = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesSelected(updatedFiles.map((f) => f.file));
  };

  const isSingleFileMode = planType === "PRO";

  return (
    <div className="space-y-4">
      {/* Plan Limit Info */}
      {hasReachedLimit && (
        <Alert
          type="warning"
          message={`Your ${planType} plan allows a maximum of ${limit} documents. Upgrade for more.`}
        />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Upload Zone */}
      {!hasReachedLimit && (
        <div
          className={`relative rounded-xl border-2 border-dashed p-8 transition-colors ${
            isDragging
              ? "border-secondary bg-secondary/5"
              : "border-outline-variant bg-surface-container-low"
          }`}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleAddFiles(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            multiple={!isSingleFileMode}
            accept={ACCEPTED_TYPES.join(",")}
            onChange={(e) => {
              if (e.target.files) {
                handleAddFiles(e.target.files);
                e.currentTarget.value = "";
              }
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />

          <div className="pointer-events-none flex flex-col items-center gap-3 text-center">
            <Upload className="h-8 w-8 text-secondary" />
            <div>
              <p className="font-semibold text-on-surface">
                {isSingleFileMode
                  ? "Upload a file"
                  : "Drag files here or click to browse"}
              </p>
              <p className="text-sm text-on-surface-variant">
                PDF, PNG, JPG (Max 10MB each)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-on-surface">
              {uploadedFiles.length} / {limit} documents
            </p>
          </div>

          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center gap-3 rounded border border-outline-variant bg-white p-3"
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.file.type === "application/pdf" ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-error/10">
                      <span className="text-xs font-bold text-error">
                        PDF
                      </span>
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary/10">
                      <span className="text-xs font-bold text-secondary">
                        IMG
                      </span>
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-on-surface">
                    {truncateFilename(uploadedFile.file.name)}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(uploadedFile.id)}
                  className="flex-shrink-0 rounded p-1 text-on-surface-variant transition-colors hover:bg-red-50 hover:text-error"
                  aria-label="Delete file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {uploadedFiles.length > 0 && (
        <Button
          type="button"
          variant="primary"
          className="w-full"
          onClick={onContinue}
          disabled={!onContinue}
        >
          Continue to Payment
        </Button>
      )}
    </div>
  );
};
