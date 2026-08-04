-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text default 'umkm'::text check (role in ('admin', 'umkm')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Trigger to automatically create profile on sign up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'umkm'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;
create policy "Categories viewable by everyone." on public.categories for select using (true);
-- Insert/Update/Delete should be restricted to admin.
create policy "Admin can insert categories." on public.categories for insert with check (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admin can update categories." on public.categories for update using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admin can delete categories." on public.categories for delete using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- 3. Create UMKMs Table
create table public.umkms (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  address text,
  whatsapp text,
  instagram text,
  maps_url text,
  logo_url text,
  banner_url text,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.umkms enable row level security;
create policy "Active UMKMs viewable by everyone." on public.umkms for select using (is_active = true);
-- Admin can view all UMKMs including inactive
create policy "Admin can view all UMKMs." on public.umkms for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "UMKM can update own data." on public.umkms for update using (
  auth.uid() = profile_id
);
create policy "Admin can manage all UMKMs." on public.umkms for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- 4. Create Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  umkm_id uuid references public.umkms(id) on delete cascade not null,
  name text not null,
  slug text not null,
  description text,
  price numeric not null,
  image_url text,
  is_available boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;
-- Public can view products of active umkms
create policy "Products viewable by everyone." on public.products for select using (
  exists (select 1 from public.umkms where umkms.id = products.umkm_id and umkms.is_active = true)
);
-- UMKM can manage own products
create policy "UMKM can insert own products." on public.products for insert with check (
  exists (select 1 from public.umkms where umkms.id = products.umkm_id and umkms.profile_id = auth.uid())
);
create policy "UMKM can update own products." on public.products for update using (
  exists (select 1 from public.umkms where umkms.id = products.umkm_id and umkms.profile_id = auth.uid())
);
create policy "UMKM can delete own products." on public.products for delete using (
  exists (select 1 from public.umkms where umkms.id = products.umkm_id and umkms.profile_id = auth.uid())
);
-- Admin can manage all products
create policy "Admin can manage all products." on public.products for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
