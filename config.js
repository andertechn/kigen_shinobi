

const SUPABASE_CONFIG = {
  URL: 'https://etojqmmhdciphantyzoa.supabase.co',
  KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0b2pxbW1oZGNpcGhhbnR5em9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyOTY5OTIsImV4cCI6MjA5ODg3Mjk5Mn0.1_zs_w7E_MZ9O5Iq4F76UQsos6i8zZhvWpjzVtsfxAA'
};


if (!SUPABASE_CONFIG.URL || !SUPABASE_CONFIG.KEY) {
  console.error('❌ ERRO: Credenciais do Supabase não configuradas em config.js');
}