# AI Rules for Project
## Architecture & Tech Stack
* Framework: React + Vite + TypeScript (Strict Mode).
* Styling: Tailwind CSS. Use `clsx` or `tailwind-merge` for class manipulation.
* State: React Query for server state, Zustand for client state.
* Backend: Supabase.

## Coding Standards
* Functional Components: Always use React functional components with named exports.
* Error Handling: Do NOT catch errors blindly. Allow them to bubble to the nearest Error Boundary unless a specific recovery strategy is required.
* Responsiveness: All UI components MUST be mobile-first (`w-full` by default, `md:w-auto` for desktop).
* JSX: Wrap JSX in parentheses in ternary operators: `cond ? (<Comp />) : null`.

## Database Safety
* Migrations: Never alter existing columns in a way that deletes data.
* RLS: Always enable Row Level Security on new tables. Default policy: `auth.uid() = user_id`.

## Vibe & Design
* Tone: Professional, minimalist.
* Components: Reuse components from `src/components/ui` (Shadcn/UI) whenever possible. Do not reinvent buttons or inputs.