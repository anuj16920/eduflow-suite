
CREATE TABLE public.cafeteria_menu (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  food_name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  calories INTEGER,
  meal_category TEXT NOT NULL DEFAULT 'lunch',
  day_of_week INTEGER NOT NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cafeteria_menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view cafeteria menu"
  ON public.cafeteria_menu FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage cafeteria menu"
  ON public.cafeteria_menu FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
