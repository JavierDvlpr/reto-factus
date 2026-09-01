-- ============================================================
-- TechStore CO — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Enum Types ───────────────────────────────────────────────────────────────
create type user_role as enum ('admin', 'customer');
create type order_status as enum ('pending', 'processing', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'processing', 'approved', 'rejected');

-- ─── Profiles (extends auth.users) ───────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null,
  role        user_role not null default 'customer',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Products ─────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  brand           text not null,
  price           numeric(12,2) not null,
  original_price  numeric(12,2),
  category        text not null,
  description     text not null default '',
  specs           jsonb not null default '{}',
  image           text,
  stock           integer not null default 0 check (stock >= 0),
  rating          numeric(3,1) not null default 4.5,
  reviews_count   integer not null default 0,
  badge           text,
  is_new_arrival  boolean not null default false,
  is_top_selling  boolean not null default false,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── Orders ───────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid references public.profiles(id) on delete set null,
  customer_name           text not null,
  customer_email          text not null,
  customer_phone          text not null,
  customer_identification text not null,
  customer_address        text not null,
  municipality_code       text not null default '11001',
  status                  order_status not null default 'pending',
  payment_method          text not null default '10',
  payment_status          payment_status not null default 'pending',
  subtotal                numeric(14,2) not null,
  tax_amount              numeric(14,2) not null,
  total                   numeric(14,2) not null,
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ─── Order Items ──────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id             uuid primary key default uuid_generate_v4(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  product_id     uuid not null,
  product_name   text not null,
  product_price  numeric(12,2) not null,
  quantity       integer not null check (quantity > 0),
  subtotal       numeric(14,2) not null,
  created_at     timestamptz not null default now()
);

-- ─── Invoices ─────────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id                      uuid primary key default uuid_generate_v4(),
  order_id                uuid not null references public.orders(id) on delete cascade,
  factus_number           text not null unique,
  reference_code          text not null,
  cufe                    text not null,
  is_validated            boolean not null default false,
  validated_at            timestamptz,
  qr_url                  text,
  public_url              text,
  total                   numeric(14,2) not null,
  customer_name           text not null,
  customer_email          text not null,
  customer_identification text not null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists products_category_idx   on public.products(category);
create index if not exists products_active_idx     on public.products(is_active);
create index if not exists orders_user_id_idx      on public.orders(user_id);
create index if not exists orders_status_idx       on public.orders(status);
create index if not exists order_items_order_idx   on public.order_items(order_id);
create index if not exists invoices_order_id_idx   on public.invoices(order_id);

-- ─── Updated-at trigger ───────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on public.products
  for each row execute function update_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function update_updated_at();
create trigger invoices_updated_at before update on public.invoices
  for each row execute function update_updated_at();
create trigger profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();

-- ─── Auto-create Profile on Sign-up ──────────────────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── Atomic Stock Reservation (prevents race conditions / overselling) ────────
-- Uses SELECT FOR UPDATE to hold an exclusive row lock while checking and
-- decrementing stock. If two requests arrive simultaneously only one will
-- succeed; the other waits for the lock and then reads the already-decremented
-- stock value, failing cleanly with a JSON error payload.
create or replace function reserve_and_decrement_stock(
  p_product_id uuid,
  p_quantity    integer
)
returns json
language plpgsql
as $$
declare
  v_stock integer;
begin
  -- Lock the row exclusively for this transaction
  select stock
    into v_stock
    from public.products
   where id = p_product_id
     for update;

  if not found then
    return json_build_object(
      'success', false,
      'error',   'Producto no encontrado',
      'available', 0
    );
  end if;

  if v_stock < p_quantity then
    return json_build_object(
      'success',   false,
      'error',     'Stock insuficiente. Solo quedan ' || v_stock || ' unidades disponibles.',
      'available', v_stock
    );
  end if;

  update public.products
     set stock = stock - p_quantity
   where id = p_product_id;

  return json_build_object(
    'success',   true,
    'remaining', v_stock - p_quantity
  );
end;
$$;

-- Keep the old helper for backwards compat (admin stock adjustments still use it)
create or replace function decrement_stock(p_product_id uuid, p_quantity integer)
returns void language plpgsql as $$
begin
  update public.products
  set stock = stock - p_quantity
  where id = p_product_id and stock >= p_quantity;
  if not found then
    raise exception 'Stock insuficiente para el producto %', p_product_id;
  end if;
end;
$$;


-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles   enable row level security;
alter table public.products   enable row level security;
alter table public.orders     enable row level security;
alter table public.order_items enable row level security;
alter table public.invoices   enable row level security;

-- Profiles
create policy "profiles: own read" on public.profiles for select
  using (auth.uid() = id);
create policy "profiles: admin full access" on public.profiles for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Products: everyone reads active, admins can write
create policy "products: public read" on public.products for select
  using (is_active = true);
create policy "products: admin write" on public.products for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Orders: users see own orders, admins see all
create policy "orders: own read" on public.orders for select
  using (user_id = auth.uid() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));
create policy "orders: insert" on public.orders for insert
  with check (true);
create policy "orders: admin update" on public.orders for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Order Items
create policy "order_items: read" on public.order_items for select
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or
      exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  ));
create policy "order_items: insert" on public.order_items for insert
  with check (true);

-- Invoices: only admins
create policy "invoices: admin only" on public.invoices for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "invoices: insert" on public.invoices for insert
  with check (true);

-- ─── Realtime Publications ────────────────────────────────────────────────────
-- Run these in Supabase Dashboard > Database > Replication
-- or via SQL:
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
