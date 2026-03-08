
-- ================================
-- EduCore School Management System
-- Complete Database Schema
-- ================================

-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student', 'parent');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'student',
  address TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (for RLS)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student')
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section TEXT,
  grade_level INTEGER,
  academic_year TEXT NOT NULL DEFAULT '2025-2026',
  capacity INTEGER DEFAULT 40,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teachers table (extends profiles)
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  employee_id TEXT UNIQUE,
  department TEXT,
  qualification TEXT,
  experience_years INTEGER DEFAULT 0,
  join_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'inactive')),
  salary NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Students table (extends profiles)
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  admission_number TEXT UNIQUE,
  class_id UUID REFERENCES public.classes(id),
  roll_number INTEGER,
  admission_date DATE DEFAULT CURRENT_DATE,
  blood_group TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'transferred', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Parents table (extends profiles)
CREATE TABLE public.parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  occupation TEXT,
  relationship TEXT DEFAULT 'father' CHECK (relationship IN ('father', 'mother', 'guardian')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Parent-Student relationship
CREATE TABLE public.parent_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (parent_id, student_id)
);

-- Teacher-Class-Subject assignment
CREATE TABLE public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2025-2026',
  UNIQUE (teacher_id, class_id, subject_id, academic_year)
);

-- Timetable
CREATE TABLE public.timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Attendance
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  check_in TIME,
  check_out TIME,
  remarks TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exams
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  exam_type TEXT DEFAULT 'midterm' CHECK (exam_type IN ('midterm', 'final', 'quiz', 'unit_test', 'practical')),
  class_id UUID REFERENCES public.classes(id),
  start_date DATE,
  end_date DATE,
  academic_year TEXT DEFAULT '2025-2026',
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exam schedules
CREATE TABLE public.exam_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) NOT NULL,
  exam_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  max_marks INTEGER DEFAULT 100,
  room TEXT
);

-- Marks / Results
CREATE TABLE public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) NOT NULL,
  marks_obtained NUMERIC(5,2),
  max_marks NUMERIC(5,2) DEFAULT 100,
  grade TEXT,
  remarks TEXT,
  entered_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fee structure
CREATE TABLE public.fee_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  class_id UUID REFERENCES public.classes(id),
  fee_type TEXT DEFAULT 'tuition' CHECK (fee_type IN ('tuition', 'transport', 'library', 'lab', 'sports', 'other')),
  academic_year TEXT DEFAULT '2025-2026',
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fee payments
CREATE TABLE public.fee_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  fee_structure_id UUID REFERENCES public.fee_structure(id) NOT NULL,
  amount_paid NUMERIC(10,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'online', 'cheque', 'card')),
  receipt_number TEXT,
  status TEXT DEFAULT 'paid' CHECK (status IN ('paid', 'partial', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Homework
CREATE TABLE public.homework (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  class_id UUID REFERENCES public.classes(id) NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) NOT NULL,
  due_date DATE NOT NULL,
  attachment_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Homework submissions
CREATE TABLE public.homework_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id UUID REFERENCES public.homework(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  submission_text TEXT,
  attachment_url TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  grade TEXT,
  feedback TEXT,
  UNIQUE (homework_id, student_id)
);

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'teachers', 'students', 'parents', 'admin')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  attachment_url TEXT,
  posted_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transport
CREATE TABLE public.transport_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name TEXT NOT NULL,
  bus_number TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  capacity INTEGER DEFAULT 40,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.transport_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.transport_routes(id) ON DELETE CASCADE NOT NULL,
  stop_name TEXT NOT NULL,
  pickup_time TIME,
  drop_time TIME,
  stop_order INTEGER DEFAULT 1
);

CREATE TABLE public.student_transport (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  route_id UUID REFERENCES public.transport_routes(id) NOT NULL,
  stop_id UUID REFERENCES public.transport_stops(id),
  UNIQUE (student_id)
);

-- E-learning / Study Materials
CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id),
  class_id UUID REFERENCES public.classes(id),
  teacher_id UUID REFERENCES public.teachers(id),
  material_type TEXT DEFAULT 'document' CHECK (material_type IN ('document', 'video', 'link', 'presentation')),
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages (Parent-Teacher interaction)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Meetings
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_by UUID REFERENCES auth.users(id),
  scheduled_with UUID REFERENCES auth.users(id),
  meeting_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  meeting_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- ================================
-- RLS Policies
-- ================================

-- Profiles: users can read all profiles, update own
CREATE POLICY "Anyone authenticated can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- User roles: only readable
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Classes: all authenticated can read, admins can manage
CREATE POLICY "Authenticated can view classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Subjects: all authenticated can read
CREATE POLICY "Authenticated can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Teachers: all authenticated can read
CREATE POLICY "Authenticated can view teachers" ON public.teachers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage teachers" ON public.teachers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Students: all authenticated can read
CREATE POLICY "Authenticated can view students" ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage students" ON public.students FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Parents
CREATE POLICY "Authenticated can view parents" ON public.parents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage parents" ON public.parents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Parent-Students
CREATE POLICY "Authenticated can view parent_students" ON public.parent_students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage parent_students" ON public.parent_students FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Teacher Assignments
CREATE POLICY "Authenticated can view assignments" ON public.teacher_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage assignments" ON public.teacher_assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Timetable
CREATE POLICY "Authenticated can view timetable" ON public.timetable FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage timetable" ON public.timetable FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Attendance
CREATE POLICY "Authenticated can view attendance" ON public.attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers and admins can manage attendance" ON public.attendance FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
);
CREATE POLICY "Teachers and admins can update attendance" ON public.attendance FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
);

-- Exams
CREATE POLICY "Authenticated can view exams" ON public.exams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage exams" ON public.exams FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Exam schedules
CREATE POLICY "Authenticated can view exam_schedules" ON public.exam_schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage exam_schedules" ON public.exam_schedules FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Marks
CREATE POLICY "Authenticated can view marks" ON public.marks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers and admins can manage marks" ON public.marks FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
);

-- Fee structure
CREATE POLICY "Authenticated can view fee_structure" ON public.fee_structure FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage fee_structure" ON public.fee_structure FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fee payments
CREATE POLICY "Authenticated can view fee_payments" ON public.fee_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage fee_payments" ON public.fee_payments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Homework
CREATE POLICY "Authenticated can view homework" ON public.homework FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers can manage homework" ON public.homework FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Teachers can update homework" ON public.homework FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);

-- Homework submissions
CREATE POLICY "Authenticated can view submissions" ON public.homework_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can submit homework" ON public.homework_submissions FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'student')
);

-- Announcements
CREATE POLICY "Authenticated can view announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and teachers can manage announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
);

-- Transport
CREATE POLICY "Authenticated can view transport_routes" ON public.transport_routes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage transport_routes" ON public.transport_routes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view transport_stops" ON public.transport_stops FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage transport_stops" ON public.transport_stops FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view student_transport" ON public.student_transport FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage student_transport" ON public.student_transport FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Study materials
CREATE POLICY "Authenticated can view study_materials" ON public.study_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers can manage study_materials" ON public.study_materials FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);

-- Messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT TO authenticated USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Authenticated can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid()
);

-- Meetings
CREATE POLICY "Users can view own meetings" ON public.meetings FOR SELECT TO authenticated USING (
  scheduled_by = auth.uid() OR scheduled_with = auth.uid()
);
CREATE POLICY "Authenticated can create meetings" ON public.meetings FOR INSERT TO authenticated WITH CHECK (
  scheduled_by = auth.uid()
);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
