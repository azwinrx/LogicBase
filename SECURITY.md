# Panduan Keamanan API - Code Academia

## ⚠️ Masalah Keamanan yang Ditemukan

### 1. API Keys Terexpose di Front-End

- **Masalah:** Supabase URL dan Anonymous Key hardcoded di `supabaseClient.js`
- **Risiko:** Siapa saja dapat mengakses dan menggunakan API credentials
- **Status:** ✅ DIPERBAIKI - Dipindahkan ke environment variables

### 2. Row Level Security (RLS) Belum Dikonfigurasi

- **Masalah:** RLS policies belum disetup dengan benar
- **Risiko:** Data tidak terlindungi dari akses unauthorized
- **Status:** ⚠️ PERLU DIKONFIGURASI

## 🔧 Langkah Perbaikan yang Dilakukan

### 1. Environment Variables

Credentials sekarang menggunakan environment variables:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### 2. File .env Setup

Buat file `.env` di root project dengan:

```
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_anon_key
```

**⚠️ PENTING: Jangan pernah commit file .env ke Git!**

### 3. Updated .gitignore

Menambahkan proteksi untuk file sensitif:

- `.env*` files
- `*.key` files
- `config/secrets.js`

## 🚨 Langkah Keamanan yang Masih Diperlukan

### 1. Konfigurasi Row Level Security (RLS)

Di Supabase Dashboard, aktifkan RLS untuk semua tables:

#### Forum Tables:

```sql
-- Enable RLS
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

-- Policies untuk forum_threads
CREATE POLICY "Users can read all threads" ON forum_threads FOR SELECT USING (true);
CREATE POLICY "Users can create their own threads" ON forum_threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own threads" ON forum_threads FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own threads" ON forum_threads FOR DELETE USING (auth.uid() = author_id);
```

#### User Progress Tables:

```sql
-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies untuk user_progress
CREATE POLICY "Users can read their own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 2. Storage Security

Untuk forum images storage bucket:

```sql
-- Storage policies
CREATE POLICY "Users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'forum-images' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'forum-images');
```

### 3. API Rate Limiting

Implementasikan rate limiting di aplikasi atau Supabase edge functions.

### 4. Input Validation & Sanitization

Tambahkan validasi input yang lebih ketat di semua form dan API calls.

## 🔐 Best Practices Keamanan

1. **Jangan pernah** commit file `.env` ke repository
2. **Selalu** gunakan ANON key di frontend, bukan SERVICE_ROLE key
3. **Aktifkan** RLS untuk semua tables yang mengandung data user
4. **Validasi** semua input dari user
5. **Monitor** API usage untuk aktivitas mencurigakan
6. **Update** dependencies secara berkala
7. **Gunakan** HTTPS untuk semua komunikasi

## 📋 Checklist Keamanan

- [x] Pindahkan API keys ke environment variables
- [x] Update .gitignore untuk proteksi file sensitif
- [ ] Konfigurasi Row Level Security (RLS)
- [ ] Setup storage bucket policies
- [ ] Implementasi rate limiting
- [ ] Input validation enhancement
- [ ] Security audit lengkap

## 🆘 Langkah Darurat

Jika API keys sudah tercommit ke repository public:

1. **Segera** regenerate Supabase keys di dashboard
2. **Update** semua environment variables
3. **Revoke** access untuk keys yang lama
4. **Monitor** usage logs untuk aktivitas mencurigakan
