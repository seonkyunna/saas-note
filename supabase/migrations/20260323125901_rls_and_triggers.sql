-- 1. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_notes ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies

-- Users: Users can read and update their own profile
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Folders: CRUD for owner
CREATE POLICY "Users can view their own folders" ON public.folders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own folders" ON public.folders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own folders" ON public.folders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own folders" ON public.folders FOR DELETE USING (auth.uid() = user_id);

-- Notes: CRUD for owner, READ for shared users
CREATE POLICY "Users can view their own notes" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view notes shared with them" ON public.notes FOR SELECT USING (
  id IN (SELECT note_id FROM public.shared_notes WHERE shared_with = auth.uid())
);
CREATE POLICY "Users can insert their own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can update notes shared with them offering write" ON public.notes FOR UPDATE USING (
  id IN (SELECT note_id FROM public.shared_notes WHERE shared_with = auth.uid() AND permission = 'write')
);
CREATE POLICY "Users can delete their own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- Shared Notes: CRUD for owner of note, READ for recipient
CREATE POLICY "Owner can manage shares" ON public.shared_notes FOR ALL USING (auth.uid() = shared_by);
CREATE POLICY "Recipient can view shares" ON public.shared_notes FOR SELECT USING (auth.uid() = shared_with);

-- 3. Auth to Public User Sync Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
