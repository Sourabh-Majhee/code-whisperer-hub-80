import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://klffjifsgfuggvvfwmjd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZmZqaWZzZ2Z1Z2d2dmZ3bWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDIyNjQsImV4cCI6MjA1MzM3ODI2NH0.y8iWALkJhNlJPXUqY1WfNuQMh25yzBPrKLf8iZ7WNlU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)