
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  module TEXT NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, module)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view role_permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage role_permissions" ON public.role_permissions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default permissions
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_edit, can_delete) VALUES
('admin', 'Student Management', true, true, true, true),
('admin', 'Attendance', true, true, true, true),
('admin', 'Exams', true, true, true, true),
('admin', 'Report Cards', true, true, true, true),
('admin', 'Fees', true, true, true, true),
('admin', 'Homework', true, true, true, true),
('admin', 'Announcements', true, true, true, true),
('admin', 'Transport', true, true, true, true),
('teacher', 'Student Management', true, false, false, false),
('teacher', 'Attendance', true, true, true, false),
('teacher', 'Exams', true, true, true, false),
('teacher', 'Report Cards', true, true, false, false),
('teacher', 'Fees', false, false, false, false),
('teacher', 'Homework', true, true, true, true),
('teacher', 'Announcements', true, true, false, false),
('teacher', 'Transport', true, false, false, false),
('student', 'Student Management', true, false, false, false),
('student', 'Attendance', true, false, false, false),
('student', 'Exams', true, false, false, false),
('student', 'Report Cards', true, false, false, false),
('student', 'Fees', true, false, false, false),
('student', 'Homework', true, false, false, false),
('student', 'Announcements', true, false, false, false),
('student', 'Transport', true, false, false, false),
('parent', 'Student Management', true, false, false, false),
('parent', 'Attendance', true, false, false, false),
('parent', 'Exams', true, false, false, false),
('parent', 'Report Cards', true, false, false, false),
('parent', 'Fees', true, false, false, false),
('parent', 'Homework', true, false, false, false),
('parent', 'Announcements', true, false, false, false),
('parent', 'Transport', true, false, false, false);
