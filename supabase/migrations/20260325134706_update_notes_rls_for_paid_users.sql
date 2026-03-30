-- Create helper function
CREATE OR REPLACE FUNCTION public.is_paid_user()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND plan IN ('pro', 'enterprise')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old Notes policies
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view notes shared with them" ON public.notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update notes shared with them offering write" ON public.notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;

-- Recreate Notes policies with paid check
CREATE POLICY "Paid users can view their own notes" ON public.notes FOR SELECT USING (auth.uid() = user_id AND public.is_paid_user());
CREATE POLICY "Paid users can view notes shared with them" ON public.notes FOR SELECT USING (
  public.is_paid_user() AND id IN (SELECT note_id FROM public.shared_notes WHERE shared_with = auth.uid())
);
CREATE POLICY "Paid users can insert their own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id AND public.is_paid_user());
CREATE POLICY "Paid users can update their own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id AND public.is_paid_user());
CREATE POLICY "Paid users can update notes shared with them offering write" ON public.notes FOR UPDATE USING (
  public.is_paid_user() AND id IN (SELECT note_id FROM public.shared_notes WHERE shared_with = auth.uid() AND permission = 'write')
);
CREATE POLICY "Paid users can delete their own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id AND public.is_paid_user());

-- Drop old Folders policies
DROP POLICY IF EXISTS "Users can view their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can insert their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;

-- Recreate Folders policies with paid check
CREATE POLICY "Paid users can view their own folders" ON public.folders FOR SELECT USING (auth.uid() = user_id AND public.is_paid_user());
CREATE POLICY "Paid users can insert their own folders" ON public.folders FOR INSERT WITH CHECK (auth.uid() = user_id AND public.is_paid_user());
CREATE POLICY "Paid users can update their own folders" ON public.folders FOR UPDATE USING (auth.uid() = user_id AND public.is_paid_user());
CREATE POLICY "Paid users can delete their own folders" ON public.folders FOR DELETE USING (auth.uid() = user_id AND public.is_paid_user());
