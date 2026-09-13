'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase.from('Course').select('*');
      if (!error && data) {
        setCourses(data);
      }
      setLoading(false);
    }
    fetchCourses();
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#1a1a1a', margin: 0, padding: 0 }}>
      {/* Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#0f172a', color: '#fff' }}>
        <h2 style={{ margin: 0, color: '#38bdf8' }}>IlmiHub</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#courses" style={{ color: '#fff', textDecoration: 'none' }}>Darussa</a>
          <button style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Shiga</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '4rem 2rem', background: '#f8fafc', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '1rem' }}>Barka da zuwa Dandalin IlmiHub</h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Koya ilimin kimiyya, sana'o'in kwamfuta, da fasaha cikin sauƙi.
        </p>
      </section>

      {/* Dynamic Course Categories from Supabase */}
      <section id="courses" style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '2rem' }}>Shahurran Darussa</h2>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Ana loda darussa daga Supabase...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: '#0284c7', marginTop: 0 }}>{course.title || course.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{course.description || 'Babu takaitaccen bayani.'}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#64748b' }}>Babu darussa a tsarin yanzu.</p>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '1.5rem', background: '#0f172a', color: '#94a3b8', fontSize: '0.9rem', marginTop: '3rem' }}>
        © 2026 IlmiHub. Duk hakki mallaka ne.
      </footer>
    </div>
  );
}
