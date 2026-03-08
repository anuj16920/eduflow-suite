UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@gmail.com';
UPDATE public.user_roles SET role = 'admin' WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'admin@gmail.com');