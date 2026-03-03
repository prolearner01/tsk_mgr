import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAIFeature() {
    console.log('Logging in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'shameercool866@gmail.com',
        password: 'test123'
    });

    if (authError) {
        console.error('Login failed:', authError.message);
        return;
    }
    
    console.log('Logged in successfully as:', authData.user?.email);

    // Get the first task or create one
    let { data: tasks, error: tasksError } = await supabase.from('tasks').select('*').limit(1);
    
    let targetTask = tasks && tasks.length > 0 ? tasks[0] : null;

    if (!targetTask) {
        console.log('No tasks found, creating a test task...');
        const { data: newTask, error: insertError } = await supabase.from('tasks').insert([
            { title: 'Learn how to ride a bicycle', priority: 'medium', status: 'pending' }
        ]).select().single();
        
        if (insertError) {
            console.error('Failed to create task:', insertError);
            return;
        }
        targetTask = newTask;
    }

    console.log(`Testing AI Subtask generation for Task: "${targetTask.title}" (ID: ${targetTask.id})`);

    try {
        const { data, error } = await supabase.functions.invoke('generate-subtasks', {
            body: { taskId: targetTask.id, title: targetTask.title }
        });

        if (error) {
            console.error('Edge function invocation failed:', error);
            return;
        }

        console.log('Edge function response:', data);

        if (data && data.subtasks && Array.isArray(data.subtasks)) {
            console.log(`Successfully generated ${data.subtasks.length} subtasks!`);
            
            // Now let's try inserting them just like the frontend does
            const inserts = data.subtasks.map((st: string) => ({
                task_id: targetTask.id,
                title: st
            }));
            
            console.log('Attempting to save subtasks to DB...');
            const { data: insertedData, error: insertError } = await supabase
                .from('subtasks')
                .insert(inserts)
                .select();
                
            if (insertError) {
                console.error('Failed to save subtasks to DB (check RLS policies):', insertError.message);
            } else {
                console.log('Successfully saved to DB! Inserted records:', insertedData.length);
            }

        } else if (data && data.error) {
             console.error('Edge function returned an error:', data.error);
        } else {
             console.log('Unexpected response structure:', data);
        }

    } catch (err) {
        console.error('Caught error during invocation:', err);
    }
}

testAIFeature();
