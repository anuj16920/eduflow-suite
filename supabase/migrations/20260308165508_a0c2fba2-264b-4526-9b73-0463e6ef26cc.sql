
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL DEFAULT '',
  user_role text NOT NULL DEFAULT 'unknown',
  action text NOT NULL,
  module text NOT NULL DEFAULT 'system',
  description text,
  ip_address text,
  device_info text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity_logs"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can insert activity_logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_activity_logs_created_at ON public.activity_logs (created_at DESC);
CREATE INDEX idx_activity_logs_user_role ON public.activity_logs (user_role);
CREATE INDEX idx_activity_logs_module ON public.activity_logs (module);
