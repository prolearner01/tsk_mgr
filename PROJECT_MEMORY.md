# Project Memory & Development Journal

Welcome to the Task Manager (`tsk_mgr`) project! This document serves as a comprehensive memory log and journal. It details everything that has been developed from scratch up to the current state, serving as a guide for onboarding new developers and planning future development.

## 🏗️ Project Overview

**Task Dashboard** is a very modern, AI-enhanced task management application.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand (for state management).
- **Backend:** Supabase (PostgreSQL Database, Authentication, Edge Functions, Storage).
- **AI Integrations:** OpenAI (GPT-4 / Embeddings) for smart task breakdowns and semantic search.

---

## 📅 Development Journal: What We've Built

### Phase 1: Foundation & Core UI
- **Initialized Project:** Set up the React application using Vite for fast bundling and TypeScript for type safety.
- **Styling Setup:** Configured Tailwind CSS for a highly responsive and modern "glassmorphism" aesthetic with vibrant light-blue backgrounds and premium UI components.
- **State Management:** Handled frontend state using Zustand stores (`useTaskStore`, `useAuthStore` for lightweight, scalable global state.

### Phase 2: Supabase Integration & Authentication
- **Database Schema:** Created the core `tasks` table with columns like `id`, `user_id`, `title`, `priority`, and `status`. Configured Row-Level Security (RLS) to ensure users only see their own tasks.
- **Authentication Flow:** Integrated Supabase Auth.
  - Built out authentication pages: `LoginPage`, `SignupPage`, and `ForgotPasswordPage`.
  - Secured the main dashboard using a `ProtectedRoute` component so only logged-in users can access their tasks.

### Phase 3: AI Subtask Generator
- **Objective:** Allow users to automatically break complex tasks into actionable steps.
- **Database Update:** Created a `subtasks` table linked to the `tasks` table via foreign keys.
- **Edge Function (`generate-subtasks`):** Developed a Supabase Edge Function that communicates with the OpenAI API.
- **Frontend Integration:** Added a "Generate Subtasks" button to the `TaskItem` component. When clicked, it passes the user's JWT to the Edge Function to authenticate and securely generate/save the subtasks.
- **Debugging Challenge:** Encountered a `401 Unauthorized` issue from the Edge function validating the JWT. Fixed this by tuning both the Edge function CORS/auth headers and the frontend token handling.

### Phase 4: User Profile & Storage
- **Objective:** Add personalized user profile components.
- **UI Update:** Designed a simple `UserProfile` and `ProfilePage` component placed in the top right corner of the dashboard.
- **Storage Integration:** Integrated Supabase File Storage.
- **Functionality:** Built a clean UI with soft shadows and a rounded preview to upload a profile picture. Uploads are placed inside the `profile-pictures` bucket securely linked to the authenticated user ID.
- **Debugging Challenge:** "Bucket not found" error during initial testing. Resolved by ensuring the Supabase Storage bucket was properly created with public/authenticated access policies configured.

### Phase 5: Smart Search (AI Semantic Vector Search)
- **Objective:** Implement a search bar that understands meaning (e.g., searching "food" finds "buy groceries") rather than just exact keyword matches.
- **Database Migrations:**
  - Enabled the `pgvector` Postgres extension.
  - Added an `embedding vector(1536)` column to the `tasks` table.
  - Created a `match_tasks` Postgres RPC (Remote Procedure Call) function to perform cosine similarity matching (threshold tuned to `0.2` for broader matches).
- **Smart Search Edge Function (`smart-search`):** Created a function that takes a user query, generates an embedding via OpenAI `text-embedding-3-small`, and calls the `match_tasks` RPC.
- **Auto-Embedding Webhook (`embed-task`):** Created a second Edge Function and a Supabase Database Trigger. Whenever a task is `INSERTED` or `UPDATED`, this trigger automatically requests the webhook to quietly generate an OpenAI embedding for the task and update the database row.
- **Data Backfill:** Ran a manual SQL query to force all older tasks to generate embeddings so that historical data would immediately be searchable.
- **Frontend UI:** Built the `SmartSearch.tsx` component with an animated search bar and visual similarities indicators showing match percentages.

---

## 📍 Current State of the Application

At this exact moment, the application is fully functional:
- Users can log in uniquely and have their session remembered.
- Users can create, update, and delete tasks instantly.
- Users can click one button to have AI magically write subtasks.
- Users can upload custom profile pictures to their profile component.
- The UI includes a highly perceptive "Smart Search" box that successfully vector matches any search term against their tasks.

**All Edge Functions and Migrations are successfully deployed to the Production Supabase Environment.**

---

## 🚀 How to Develop Further (For New Developers)

If you are joining or picking up this project, here is how you can continue development:

### Running the App Locally
1. Run `npm install` to ensure you have all Node dependencies.
2. Run `npm run dev` to start the Vite local development server (usually runs on `localhost:5173`).
3. Ensure `.env` is populated with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Working with Supabase Edge Functions
If you want to edit the backend AI logic:
1. Ensure the Supabase CLI is installed (`npx supabase`).
2. Log in using `npx supabase login`.
3. To test functions locally: `npx supabase functions serve`
4. To deploy your changes: `npx supabase functions deploy <function_name>`
5. Make sure the Supabase Cloud dashboard has any required environment secrets (like `OPENAI_API_KEY`) set under "Edge Functions -> Secrets".

### Future Feature Ideas
1. **Notifications:** Implement Supabase Realtime to push notifications when background AI generating finishes instead of polling.
2. **Task Categorization:** Auto-tag tasks into categories (Work, Personal, Urgent) when they are generated using a simple LLM classification pipeline.
3. **Collaboration:** Extend RLS policies to allow task sharing or team workspaces.
4. **Offline Mode:** Switch from standard Zustand to a sync-based local-first architecture so tasks can be created and stored in IndexedDB while on an airplane, and synced to Supabase when reconnected.
