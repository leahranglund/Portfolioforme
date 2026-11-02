# Supabase setup for certifications

The portfolio is hosted on GitHub Pages, which cannot provide private server-side
administration by itself. Supabase handles authentication, storage, and database
permissions for the certification editor.

## 1. Create the Supabase project

Create a Supabase project, then open **SQL Editor** and run all of
[`supabase-setup.sql`](./supabase-setup.sql).

## 2. Create the private admin login

In **Authentication → Users**, create the owner's user with email and password.
Do not enable public sign-ups. Copy that user's UUID and run this query in the
SQL Editor, replacing the example UUID:

```sql
insert into public.admin_users (user_id)
values ('PASTE-THE-OWNER-USER-UUID-HERE');
```

The admin interface is not linked from the public navigation, but hiding a URL
is not a security control. All reads and writes are protected by Supabase
authentication and row-level security.

## 3. Configure the public client

In the Supabase project settings, copy the **Project URL** and the **publishable
key** (or legacy `anon` key) into [`supabase-config.js`](./supabase-config.js):

```js
export const SUPABASE_URL = "https://your-project.supabase.co";
export const SUPABASE_ANON_KEY = "your-publishable-key";
```

The publishable/anon key is expected to be public in a browser app; row-level
security protects the data. Never put a `service_role` or secret key in this
repository.

## 4. Use the editor

After the site is deployed, open `admin.html` directly and sign in with the user
created above. Add, edit, publish, hide, reorder, or delete certifications and
courses there. For each item, use **Beskrivelse** for the short explanation that
appears when a visitor opens the course box, and **Lenke til sertifikat** for a
certificate or course URL. Published items appear as expandable boxes on
`Sertifiseringer.html`.

## 5. First-time checklist

1. Run `supabase-setup.sql` in the Supabase SQL Editor.
2. Create the private admin user and add its UUID to `admin_users`.
3. Paste the Project URL and publishable/anon key into `supabase-config.js`.
4. Deploy the site and open `admin.html`.
5. Add a description and certificate link, then enable **Vis offentlig**.

The public page only displays published rows. The description and certificate
link are optional, so a course can also be listed without either one.
