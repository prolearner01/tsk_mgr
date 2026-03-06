-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Add a new column to the tasks table for storing embeddings
alter table tasks add column if not exists embedding vector(1536);

-- Create a function to search for tasks
create or replace function match_tasks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  user_id_param uuid
)
returns table (
  id uuid,
  title text,
  priority text,
  status text,
  similarity float
)
language sql stable
as $$
  select
    tasks.id,
    tasks.title,
    tasks.priority,
    tasks.status,
    1 - (tasks.embedding <=> query_embedding) as similarity
  from tasks
  where 
    tasks.user_id = user_id_param 
    and 1 - (tasks.embedding <=> query_embedding) > match_threshold
  order by tasks.embedding <=> query_embedding
  limit match_count;
$$;
