import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    console.log('Logging in...');
    const { error } = await supabase.auth.signInWithPassword({
        email: 'shameercool866@gmail.com',
        password: 'test123'
    });
    if (error) {
        console.error('Login error:', error);
        return;
    }

    console.log('Invoking function with overridden Anon Key...');
    const { data, error: invokeError } = await supabase.functions.invoke('generate-subtasks', {
        body: { taskId: '123', title: 'Plan an intergalactic journey' },
        headers: { Authorization: `Bearer ${supabaseAnonKey}` }
    });

    if (invokeError) {
        console.error('Invoke Error:', invokeError);
    } else {
        console.log('Invoke Success Data:', data);
    }
}
run();
