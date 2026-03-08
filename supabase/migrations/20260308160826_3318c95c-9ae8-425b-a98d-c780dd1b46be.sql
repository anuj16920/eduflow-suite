
CREATE TABLE public.hostel_buildings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'boys',
  total_floors INTEGER DEFAULT 3,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.hostel_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  building_id UUID NOT NULL REFERENCES public.hostel_buildings(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  floor INTEGER NOT NULL DEFAULT 0,
  total_beds INTEGER NOT NULL DEFAULT 4,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.hostel_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.hostel_rooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  bed_number INTEGER,
  allocated_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, bed_number)
);

ALTER TABLE public.hostel_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view hostel_buildings" ON public.hostel_buildings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage hostel_buildings" ON public.hostel_buildings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can view hostel_rooms" ON public.hostel_rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage hostel_rooms" ON public.hostel_rooms FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can view hostel_allocations" ON public.hostel_allocations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage hostel_allocations" ON public.hostel_allocations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
