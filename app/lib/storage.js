const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export const storageUrl = (path) =>
  `${SUPABASE_URL}/storage/v1/object/public/${path}`