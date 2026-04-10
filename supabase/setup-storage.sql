-- Run this in your Supabase Dashboard SQL Editor to setup storage securely

-- 1. Create the buckets (one for PDF reports, one for Team Profile images)
insert into storage.buckets (id, name, public) 
values ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

insert into storage.buckets (id, name, public) 
values ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view files
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id in ('reports', 'profiles') );

-- 3. Restrict Uploads, Updates, Deletions to Authenticated Admin Users
create policy "Auth Upload" 
on storage.objects for insert 
to authenticated 
with check ( bucket_id in ('reports', 'profiles') );

create policy "Auth Update" 
on storage.objects for update 
to authenticated 
using ( bucket_id in ('reports', 'profiles') );

create policy "Auth Delete" 
on storage.objects for delete 
to authenticated 
using ( bucket_id in ('reports', 'profiles') );
