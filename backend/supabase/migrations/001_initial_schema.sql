-- Enable RLS
alter table auth.users enable row level security;

-- Create enums
create type work_order_status as enum ('open', 'in_progress', 'completed', 'cancelled');
create type work_order_priority as enum ('low', 'medium', 'high', 'urgent');
create type user_role as enum ('admin', 'manager', 'technician', 'customer');

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text,
  role user_role default 'customer',
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Work orders table
create table work_orders (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status work_order_status default 'open',
  priority work_order_priority default 'medium',
  assigned_to uuid references profiles(id),
  created_by uuid references profiles(id) not null,
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  customer_name text,
  customer_email text,
  customer_phone text,
  location text,
  estimated_hours numeric,
  actual_hours numeric,
  cost_estimate numeric,
  final_cost numeric,
  notes text
);

-- Work order attachments table
create table work_order_attachments (
  id uuid default gen_random_uuid() primary key,
  work_order_id uuid references work_orders(id) on delete cascade not null,
  file_name text not null,
  file_url text not null,
  file_size bigint not null,
  mime_type text not null,
  uploaded_by uuid references profiles(id) not null,
  created_at timestamptz default now()
);

-- Work order comments table
create table work_order_comments (
  id uuid default gen_random_uuid() primary key,
  work_order_id uuid references work_orders(id) on delete cascade not null,
  comment text not null,
  created_by uuid references profiles(id) not null,
  created_at timestamptz default now(),
  is_internal boolean default false
);

-- RLS Policies

-- Profiles policies
alter table profiles enable row level security;

create policy "Users can view all profiles" on profiles
  for select using (true);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Work orders policies
alter table work_orders enable row level security;

create policy "Users can view work orders they created or are assigned to" on work_orders
  for select using (
    auth.uid() = created_by or 
    auth.uid() = assigned_to or
    (select role from profiles where id = auth.uid()) in ('admin', 'manager')
  );

create policy "Users can create work orders" on work_orders
  for insert with check (auth.uid() = created_by);

create policy "Users can update work orders they created or are assigned to" on work_orders
  for update using (
    auth.uid() = created_by or 
    auth.uid() = assigned_to or
    (select role from profiles where id = auth.uid()) in ('admin', 'manager')
  );

create policy "Admins and managers can delete work orders" on work_orders
  for delete using (
    (select role from profiles where id = auth.uid()) in ('admin', 'manager')
  );

-- Work order attachments policies
alter table work_order_attachments enable row level security;

create policy "Users can view attachments for accessible work orders" on work_order_attachments
  for select using (
    exists (
      select 1 from work_orders wo 
      where wo.id = work_order_id and (
        auth.uid() = wo.created_by or 
        auth.uid() = wo.assigned_to or
        (select role from profiles where id = auth.uid()) in ('admin', 'manager')
      )
    )
  );

create policy "Users can add attachments to accessible work orders" on work_order_attachments
  for insert with check (
    exists (
      select 1 from work_orders wo 
      where wo.id = work_order_id and (
        auth.uid() = wo.created_by or 
        auth.uid() = wo.assigned_to or
        (select role from profiles where id = auth.uid()) in ('admin', 'manager')
      )
    )
  );

-- Work order comments policies
alter table work_order_comments enable row level security;

create policy "Users can view comments for accessible work orders" on work_order_comments
  for select using (
    exists (
      select 1 from work_orders wo 
      where wo.id = work_order_id and (
        auth.uid() = wo.created_by or 
        auth.uid() = wo.assigned_to or
        (select role from profiles where id = auth.uid()) in ('admin', 'manager')
      )
    )
  );

create policy "Users can add comments to accessible work orders" on work_order_comments
  for insert with check (
    exists (
      select 1 from work_orders wo 
      where wo.id = work_order_id and (
        auth.uid() = wo.created_by or 
        auth.uid() = wo.assigned_to or
        (select role from profiles where id = auth.uid()) in ('admin', 'manager')
      )
    )
  );

-- Functions
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Update timestamp function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_work_orders_updated_at
  before update on work_orders
  for each row execute procedure update_updated_at_column();