import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useI18n } from "@/contexts/I18nContext";

export default function ProfileEditor({ onUpdate }: { onUpdate?: () => void }) {
  const { t } = useI18n();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const data = await readAsDataUrl(file);
    setPhotoPreview(data);
  };

  const handleKycChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setKycFiles((prev) => [...prev, ...files]);
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;
    setLoading(true);
    try {
      const dataUrl = await readAsDataUrl(photoFile);
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/auth/upload-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ filename: photoFile.name, data: dataUrl }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Profile photo uploaded");
        onUpdate && onUpdate();
      } else {
        toast.error(json.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const uploadKyc = async () => {
    if (kycFiles.length === 0) return;
    setLoading(true);
    try {
      const docs = await Promise.all(
        kycFiles.map(async (f) => ({
          filename: f.name,
          data: await readAsDataUrl(f),
          type: "kyc",
        })),
      );
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/auth/upload-kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ docs }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success("KYC documents uploaded");
        setKycFiles([]);
        onUpdate && onUpdate();
      } else {
        toast.error(json.message || "KYC upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("KYC upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-[hsl(var(--muted))] rounded-full overflow-hidden flex items-center justify-center">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-sm text-gray-500">No photo</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer">
            <Input type="file" onChange={handlePhotoChange} accept="image/*" />
          </label>
          <Button
            onClick={uploadPhoto}
            disabled={!photoFile || loading}
            className="bg-[hsl(var(--primary))]"
          >
            {loading ? t("loading") : t("uploadPhoto")}
          </Button>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">KYC Documents</div>
        <Input type="file" multiple onChange={handleKycChange} />
        <div className="mt-2 space-y-1">
          {kycFiles.map((f) => (
            <div key={f.name} className="text-sm text-gray-600">
              {f.name}
            </div>
          ))}
        </div>
        <div className="mt-2">
          <Button
            onClick={uploadKyc}
            disabled={kycFiles.length === 0 || loading}
            className="bg-[hsl(var(--primary))]"
          >
            {loading ? t("loading") : t("uploadKYC")}
          </Button>
        </div>
      </div>
    </div>
  );
}
