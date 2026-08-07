import { supabase } from "@/lib/supabase";

const BUCKET = "media";

export const StorageRepository = {
  /**
   * Uploads a file to the "media" bucket under the given folder
   * (e.g. "cakes" or "blog") and returns its public URL.
   */
  async uploadImage(file: File, folder: string) {
    const ext = file.name.split(".").pop();
    const randomName = `${crypto.randomUUID()}.${ext}`;
    const path = `${folder}/${randomName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return { url: data.publicUrl, error: null };
  },

  async deleteImage(path: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    return { error };
  },
};
