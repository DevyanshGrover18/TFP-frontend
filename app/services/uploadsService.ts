import { fetchApi } from "./api";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

type SignedUploadResponse = {
  upload?: {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    folder: string;
    signature: string;
  };
};

function assertImageSize(file: File) {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`${file.name} exceeds the 5 MB image size limit`);
  }
}

export async function uploadProductImage(file: File, folder: string) {
  assertImageSize(file);

  const { upload } = await fetchApi<SignedUploadResponse>(
    "/products/upload-signature",
    {
      method: "POST",
      body: JSON.stringify({ folder }),
    },
  );

  if (!upload) {
    throw new Error("Failed to prepare image upload");
  }

  const formData = new FormData();
  formData.set("file", file);
  formData.set("api_key", upload.apiKey);
  formData.set("timestamp", String(upload.timestamp));
  formData.set("signature", upload.signature);
  formData.set("folder", upload.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${upload.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = (await response.json().catch(() => ({}))) as {
    secure_url?: string;
    error?: {
      message?: string;
    };
  };

  if (!response.ok || typeof data.secure_url !== "string") {
    throw new Error(data.error?.message ?? "Failed to upload image");
  }

  return data.secure_url;
}
