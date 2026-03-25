// Growther AI - Shared Config
window.GROWTHER = window.GROWTHER || {};

GROWTHER.SUPABASE_URL = 'https://frficzdzmxhptmtbkfft.supabase.co';
GROWTHER.SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZmljemR6bXhocHRtdGJrZmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzM4NTYsImV4cCI6MjA4MzQ0OTg1Nn0.3ij2AfqftY3flBnPPbU652qvGqOLkT_QCn_JxJHIQLI';
GROWTHER.CAL_LINK = 'https://cal.com/ahmetcagatay/15min';

// Admin detection: set by dashboard login, checked by all trackers
GROWTHER.isAdmin = false;
try { GROWTHER.isAdmin = localStorage.getItem('growther_admin') === 'true'; } catch(e) {}

// Skip tracking entirely if ?t=0
GROWTHER.skipTracking = new URLSearchParams(window.location.search).get('t') === '0';

// Supabase REST helper
GROWTHER.supaFetch = function(method, path, body) {
  return fetch(GROWTHER.SUPABASE_URL + '/rest/v1/' + path, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': GROWTHER.SUPABASE_ANON,
      'Authorization': 'Bearer ' + GROWTHER.SUPABASE_ANON,
      'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
    },
    body: JSON.stringify(body)
  });
};
