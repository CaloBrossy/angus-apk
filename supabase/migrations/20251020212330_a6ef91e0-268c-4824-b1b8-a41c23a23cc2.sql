-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create cabanas table
CREATE TABLE public.cabanas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  logo_url TEXT,
  ubicacion TEXT NOT NULL,
  descripcion TEXT,
  animales_destacados INTEGER DEFAULT 0,
  remates_activos INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on cabanas
ALTER TABLE public.cabanas ENABLE ROW LEVEL SECURITY;

-- Cabanas policies
CREATE POLICY "Anyone can view cabanas"
  ON public.cabanas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own cabanas"
  ON public.cabanas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cabanas"
  ON public.cabanas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create remates table
CREATE TABLE public.remates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabana_id UUID REFERENCES public.cabanas(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMPTZ NOT NULL,
  ubicacion TEXT NOT NULL,
  precio_base DECIMAL(10, 2),
  categoria TEXT NOT NULL,
  imagen_url TEXT,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'finalizado', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on remates
ALTER TABLE public.remates ENABLE ROW LEVEL SECURITY;

-- Remates policies
CREATE POLICY "Anyone can view active remates"
  ON public.remates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Cabana owners can create remates"
  ON public.remates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cabanas
      WHERE cabanas.id = cabana_id AND cabanas.user_id = auth.uid()
    )
  );

CREATE POLICY "Cabana owners can update their remates"
  ON public.remates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cabanas
      WHERE cabanas.id = cabana_id AND cabanas.user_id = auth.uid()
    )
  );

-- Create noticias table
CREATE TABLE public.noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  imagen_url TEXT,
  categoria TEXT NOT NULL,
  autor TEXT NOT NULL,
  fecha_publicacion TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on noticias
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

-- Noticias policies
CREATE POLICY "Anyone can view noticias"
  ON public.noticias FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create noticias"
  ON public.noticias FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update noticias"
  ON public.noticias FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create conversaciones table for assistant feature
CREATE TABLE public.conversaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mensaje TEXT NOT NULL,
  respuesta TEXT,
  tipo TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on conversaciones
ALTER TABLE public.conversaciones ENABLE ROW LEVEL SECURITY;

-- Conversaciones policies
CREATE POLICY "Users can view their own conversaciones"
  ON public.conversaciones FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversaciones"
  ON public.conversaciones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cabanas_updated_at
  BEFORE UPDATE ON public.cabanas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_remates_updated_at
  BEFORE UPDATE ON public.remates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_noticias_updated_at
  BEFORE UPDATE ON public.noticias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    NEW.email
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();