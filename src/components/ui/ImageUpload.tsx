"use client";

import { useRef, useState } from "react";
import { StorageRepository } from "@/lib/repositories/storageRepository";

type Props = {
  folder: string;
  onUploaded: (url: string) => void;
  label?: string;
};

export default function ImageUpload({ folder, onUploaded, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const { url, error: uploadError } = await StorageRepository.uploadImage(
      file,
      folder,
    );

    setUploading(false);

    if (uploadError || !url) {
      setError(uploadError?.message ?? "Upload failed");
      return;
    }

    onUploaded(url);

    // Reset the input so the same file can be picked again if needed
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="font-body text-xs"
      />
      {uploading && (
        <p className="font-body text-xs text-cocoa-soft mt-1">
          Uploading{label ? ` ${label}` : ""}...
        </p>
      )}
      {error && <p className="font-body text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
