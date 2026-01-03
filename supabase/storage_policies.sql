-- RUN THIS AS SERVICE ROLE (or via Dashboard Storage > Policies UI)
begin;

-- Ensure bucket exists (private)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'gallery') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', false);
  END IF;
END $$;

-- Enable RLS (typically already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Clear previous policies (if any)
DROP POLICY IF EXISTS "gallery_select_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "gallery_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "gallery_update_owner" ON storage.objects;
DROP POLICY IF EXISTS "gallery_delete_owner" ON storage.objects;

-- Read for authenticated users in gallery bucket
CREATE POLICY "gallery_select_authenticated" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'gallery');

-- Insert allowed for authenticated users into gallery bucket
CREATE POLICY "gallery_insert_authenticated" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Update/Delete only by owner (the user who uploaded)
CREATE POLICY "gallery_update_owner" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND owner = auth.uid());

CREATE POLICY "gallery_delete_owner" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'gallery' AND owner = auth.uid());

commit;
