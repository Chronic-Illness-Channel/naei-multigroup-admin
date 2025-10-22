## NAEI Multigroup Admin Portal

Admin interface for managing NAEI group data with Supabase authentication, CRUD flows, and audit logging. Built with Next.js App Router, TypeScript, Tailwind, and Supabase SSR helpers.

### Project structure

- `src/app/(auth)`: Public authentication routes (login) with shared layout
- `src/app/(dashboard)`: Protected admin shell, groups management, and server actions
- `src/lib/supabase`: Supabase client factories and generated-type placeholders
- `migrations/`: Reserved for SQL migrations or Supabase migration scripts

### Environment variables

Copy `.env.example` to `.env.local` and supply real values:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NAEI_GROUP_SYNC_FUNCTION=sync_naei_groups
```

> The `SUPABASE_SERVICE_ROLE_KEY` is required for server-side audit logging. Keep it on the server only.

### Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The root route redirects users to `/login` or `/groups` based on Supabase session state. Use Supabase Auth admin users to sign in.

### Testing and linting

```bash
npm run lint
```

Add your preferred testing strategy (Playwright, Vitest, etc.) as the project evolves.

### Supabase types

`src/lib/supabase/types.ts` contains placeholder typings. Replace them with generated types by running `supabase gen types typescript ...` once your database schema is available.
# naei-multigroup-admin
