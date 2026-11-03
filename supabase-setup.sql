create table if not exists public.admin_users (
    user_id uuid primary key references auth.users (id) on delete cascade,
    created_at timestamptz not null default now()
);

create table if not exists public.certifications (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    title_en text not null default '',
    provider text not null default '',
    description text not null default '',
    description_en text not null default '',
    status text check (status in ('Fullført', 'Pågående')),
    completed_on date,
    credential_url text,
    sort_order integer not null default 0,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    constraint certifications_title_provider_key unique (title, provider)
);

alter table public.certifications add column if not exists title_en text not null default '';
alter table public.certifications add column if not exists description_en text not null default '';

update public.certifications
set title_en = case title
    when 'Google Skillshop' then 'Google Skillshop'
    when 'Claude Academy' then 'Claude Academy'
    when 'HubSpot Academy' then 'HubSpot Academy'
    when 'Meta Blueprint' then 'Meta Blueprint'
    else title_en
end,
description_en = case title
    when 'Google Skillshop' then 'Online courses and training in Google''s tools for digital marketing and analytics.'
    when 'Claude Academy' then 'Training in using Claude and generative AI effectively.'
    when 'HubSpot Academy' then 'Courses in inbound marketing, content creation, sales and CRM.'
    when 'Meta Blueprint' then 'Training in advertising, content strategy and marketing on Meta platforms.'
    else description_en
end
where title in ('Google Skillshop', 'Claude Academy', 'HubSpot Academy', 'Meta Blueprint');

insert into public.certifications (title, title_en, description, description_en, sort_order, is_published)
values
    ('Google Skillshop', 'Google Skillshop', 'Nettbaserte kurs og opplæring i Googles verktøy for digital markedsføring og analyse.', 'Online courses and training in Google''s tools for digital marketing and analytics.', 10, true),
    ('Claude Academy', 'Claude Academy', 'Opplæring i å bruke Claude og generativ kunstig intelligens på en effektiv måte.', 'Training in using Claude and generative AI effectively.', 20, true),
    ('HubSpot Academy', 'HubSpot Academy', 'Kurs innen inbound marketing, innholdsproduksjon, salg og CRM.', 'Courses in inbound marketing, content creation, sales and CRM.', 30, true),
    ('Meta Blueprint', 'Meta Blueprint', 'Opplæring i annonsering, innholdsstrategi og markedsføring på Metas plattformer.', 'Training in advertising, content strategy and marketing on Meta platforms.', 40, true)
on conflict (title, provider) do nothing;

alter table public.admin_users enable row level security;
alter table public.certifications enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.admin_users
        where user_id = (select auth.uid())
    );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

grant select on public.certifications to anon, authenticated;
grant insert, update, delete on public.certifications to authenticated;

drop policy if exists "Anyone can read published certifications" on public.certifications;
create policy "Anyone can read published certifications"
    on public.certifications for select
    to anon, authenticated
    using (is_published = true);

drop policy if exists "Admins can read all certifications" on public.certifications;
create policy "Admins can read all certifications"
    on public.certifications for select
    to authenticated
    using ((select public.is_admin()));

drop policy if exists "Admins can insert certifications" on public.certifications;
create policy "Admins can insert certifications"
    on public.certifications for insert
    to authenticated
    with check ((select public.is_admin()));

drop policy if exists "Admins can update certifications" on public.certifications;
create policy "Admins can update certifications"
    on public.certifications for update
    to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

drop policy if exists "Admins can delete certifications" on public.certifications;
create policy "Admins can delete certifications"
    on public.certifications for delete
    to authenticated
    using ((select public.is_admin()));
