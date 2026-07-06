import { createClient } from '@supabase/supabase-js';

// Get keys from env variables first, then fallback to localStorage if they configure it inside the UI
const getSupabaseConfig = () => {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
  
  const localUrl = localStorage.getItem('liberty_assist_supabase_url') || '';
  const localKey = localStorage.getItem('liberty_assist_supabase_key') || '';
  
  return {
    url: envUrl || localUrl,
    key: envKey || localKey,
    isReal: !!(envUrl || localUrl) && !!(envKey || localKey)
  };
};

const config = getSupabaseConfig();

// Initialize real Supabase or export a mock helper
export const isSupabaseConfigured = () => {
  const current = getSupabaseConfig();
  return current.isReal;
};

export const getSupabaseClient = () => {
  const current = getSupabaseConfig();
  if (current.isReal) {
    return createClient(current.url, current.key);
  }
  return null;
};

// Create a highly robust Mock Supabase database that mimics Auth and Database APIs using LocalStorage
// This guarantees that the user can immediately test sign-in, profile switching, and saving without needing a database set up.
export const mockSupabase = {
  auth: {
    getUser: async () => {
      const activeUser = localStorage.getItem('mock_supabase_active_user');
      if (activeUser) {
        return { data: { user: JSON.parse(activeUser) }, error: null };
      }
      return { data: { user: null }, error: null };
    },
    signUp: async ({ email, password, options }) => {
      // Simulate network latency
      await new Promise(r => setTimeout(r, 600));
      
      const users = JSON.parse(localStorage.getItem('mock_supabase_users') || '[]');
      if (users.find(u => u.email === email)) {
        return { data: null, error: { message: "User already exists with this email address." } };
      }
      
      const newUser = {
        id: 'mock-uuid-' + Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: options?.data || {}
      };
      
      users.push({ ...newUser, password });
      localStorage.setItem('mock_supabase_users', JSON.stringify(users));
      
      // Auto login
      localStorage.setItem('mock_supabase_active_user', JSON.stringify(newUser));
      
      // Save profile
      const profiles = JSON.parse(localStorage.getItem('mock_supabase_profiles') || '[]');
      const newProfile = {
        id: newUser.id,
        full_name: options?.data?.full_name || 'Anonymous User',
        role: options?.data?.role || 'citizen',
        state: options?.data?.state || 'NY',
        created_at: new Date().toISOString()
      };
      profiles.push(newProfile);
      localStorage.setItem('mock_supabase_profiles', JSON.stringify(profiles));
      
      return { data: { user: newUser }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      await new Promise(r => setTimeout(r, 600));
      const users = JSON.parse(localStorage.getItem('mock_supabase_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { data: null, error: { message: "Invalid login credentials." } };
      }
      
      const cleanUser = { id: user.id, email: user.email, user_metadata: user.user_metadata };
      localStorage.setItem('mock_supabase_active_user', JSON.stringify(cleanUser));
      return { data: { user: cleanUser }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('mock_supabase_active_user');
      return { error: null };
    }
  },
  
  // Database API simulator
  from: (table) => {
    return {
      select: (columns) => {
        return {
          eq: (field, value) => {
            return {
              single: async () => {
                await new Promise(r => setTimeout(r, 100));
                const items = JSON.parse(localStorage.getItem(`mock_supabase_${table}`) || '[]');
                const found = items.find(item => item[field] === value);
                return { data: found || null, error: found ? null : { message: "Row not found" } };
              },
              order: async (orderField, { ascending } = { ascending: false }) => {
                await new Promise(r => setTimeout(r, 200));
                let items = JSON.parse(localStorage.getItem(`mock_supabase_${table}`) || '[]');
                items = items.filter(item => item[field] === value);
                items.sort((a, b) => {
                  const valA = a[orderField];
                  const valB = b[orderField];
                  if (valA < valB) return ascending ? -1 : 1;
                  if (valA > valB) return ascending ? 1 : -1;
                  return 0;
                });
                return { data: items, error: null };
              }
            };
          }
        };
      },
      upsert: async (row) => {
        await new Promise(r => setTimeout(r, 100));
        const items = JSON.parse(localStorage.getItem(`mock_supabase_${table}`) || '[]');
        const index = items.findIndex(item => item.id === row.id);
        if (index >= 0) {
          items[index] = { ...items[index], ...row };
        } else {
          items.push(row);
        }
        localStorage.setItem(`mock_supabase_${table}`, JSON.stringify(items));
        return { data: row, error: null };
      },
      insert: async (row) => {
        await new Promise(r => setTimeout(r, 150));
        const items = JSON.parse(localStorage.getItem(`mock_supabase_${table}`) || '[]');
        const newRow = { ...row, id: row.id || 'row-uuid-' + Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
        items.push(newRow);
        localStorage.setItem(`mock_supabase_${table}`, JSON.stringify(items));
        return { data: newRow, error: null };
      },
      delete: () => {
        return {
          eq: (field, value) => {
            return {
              eq: async (field2, value2) => {
                await new Promise(r => setTimeout(r, 150));
                let items = JSON.parse(localStorage.getItem(`mock_supabase_${table}`) || '[]');
                items = items.filter(item => !(item[field] === value && item[field2] === value2));
                localStorage.setItem(`mock_supabase_${table}`, JSON.stringify(items));
                return { error: null };
              }
            };
          }
        };
      }
    };
  }
};
