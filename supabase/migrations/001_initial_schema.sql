create extension if not exists vector;

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamp with time zone default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  messages jsonb default '[]',
  domain text,
  language text default 'fr',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists legal_documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  code_name text not null,
  article_number text,
  content text not null,
  source_url text,
  bulletin_officiel text,
  embedding vector(1536),
  created_at timestamp with time zone default now()
);

create index if not exists legal_documents_embedding_idx
on legal_documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);

alter table profiles enable row level security;
alter table conversations enable row level security;
alter table legal_documents enable row level security;

create policy "profil select" on profiles for select using (auth.uid() = id);
create policy "profil update" on profiles for update using (auth.uid() = id);
create policy "conv select" on conversations for select using (auth.uid() = user_id);
create policy "conv insert" on conversations for insert with check (auth.uid() = user_id);
create policy "conv update" on conversations for update using (auth.uid() = user_id);
create policy "conv delete" on conversations for delete using (auth.uid() = user_id);
create policy "docs public" on legal_documents for select using (true);
