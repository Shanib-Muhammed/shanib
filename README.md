# Proposal site: 2 connected pages

- `index.html`: name screen, proposal, Yes / runaway No (what she sees)
- `admin.html`: password page that shows her name and answer (what you see)
- `store.js`: the connection between the two pages

## Quick test (same browser only)
Open index.html, answer, then open admin.html in the same browser. Password: `password`.

## Make it work across phones (free, Supabase)
1. Create a project at supabase.com.
2. SQL Editor, run:

    create table events (
      id bigint generated always as identity primary key,
      type text, who text, t bigint
    );
    alter table events enable row level security;
    create policy "anyone can add" on events for insert to anon with check (true);
    create policy "anyone can read" on events for select to anon using (true);

3. Project Settings > API: copy the Project URL and the anon public key into `store.js`.
4. Upload all files to a host (Netlify, GitHub Pages, Vercel).

Note: the admin password is checked in the browser and the table is readable with the anon key, so don't treat this as secure.
