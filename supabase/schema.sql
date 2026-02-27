-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    lock_text TEXT DEFAULT 'The Day We Got Together',
    hint TEXT DEFAULT 'Hint: MM/DD',
    passcode TEXT DEFAULT '1402',
    color_theme TEXT DEFAULT '#d4145a',
    heading_text TEXT DEFAULT 'Happy Anniversary!',
    subheading_text TEXT DEFAULT 'One year down, forever to go 🤍\nLet’s complete these 50 promises together...',
    progress_text TEXT DEFAULT 'Gina & Aldo''s Journey',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    photo_url TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies (For this simple app, we'll allow public read/write by slug)
CREATE POLICY "Public read tenants" ON tenants FOR SELECT USING (true);
CREATE POLICY "Public read tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Public insert tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update tasks" ON tasks FOR UPDATE USING (true);
