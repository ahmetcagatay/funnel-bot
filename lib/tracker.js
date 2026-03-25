// Growther AI - Unified Tracker
// Usage:
//   Rapor:        <script src="/lib/tracker.js" data-type="rapor" data-client="danexai"></script>
//   Demo Funnel:  <script src="/lib/tracker.js" data-type="demo-funnel" data-client="danexai" data-total-steps="8"></script>
//   Ana Funnel:   uses its own sync, just checks GROWTHER.isAdmin for is_test flag

(function() {
  'use strict';
  if (!window.GROWTHER || GROWTHER.skipTracking) return;

  var script = document.currentScript;
  var type = script && script.getAttribute('data-type');
  if (!type) return;

  var client = (script && script.getAttribute('data-client')) || window.location.pathname.split('/')[1] || 'unknown';
  var SU = GROWTHER.SUPABASE_URL;
  var SK = GROWTHER.SUPABASE_ANON;
  var isAdmin = GROWTHER.isAdmin;

  // ============ RAPOR TRACKER ============
  if (type === 'rapor') {
    var tId = null, st = Date.now(), ms = 0;

    window.addEventListener('scroll', function() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) { var p = Math.round((window.pageYOffset / h) * 100); if (p > ms) ms = p; }
    });

    function gd() {
      return {
        website: window.location.pathname,
        stage: 'rapor_view',
        extra_notes: JSON.stringify({
          time_on_page: Math.round((Date.now() - st) / 1000),
          scroll_depth: ms,
          reached_bottom: ms >= 90,
          client: client,
          page_type: 'rapor',
          opened_at: new Date(st).toISOString(),
          is_test: isAdmin
        }),
        last_step: ms >= 90 ? 'reached_bottom' : (ms > 10 ? 'scrolling' : 'opened'),
        completed: ms >= 90
      };
    }

    fetch(SU + '/rest/v1/funnel_leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SK, 'Authorization': 'Bearer ' + SK, 'Prefer': 'return=representation' },
      body: JSON.stringify(gd())
    }).then(function(r) { return r.json(); }).then(function(d) { if (d && d[0]) tId = d[0].id; }).catch(function() {});

    setInterval(function() {
      if (!tId) return;
      fetch(SU + '/rest/v1/funnel_leads?id=eq.' + tId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'apikey': SK, 'Authorization': 'Bearer ' + SK, 'Prefer': 'return=minimal' },
        body: JSON.stringify(gd())
      }).catch(function() {});
    }, 10000);

    window.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden' && tId) {
        fetch(SU + '/rest/v1/funnel_leads?id=eq.' + tId, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'apikey': SK, 'Authorization': 'Bearer ' + SK, 'Prefer': 'return=minimal' },
          body: JSON.stringify(gd()), keepalive: true
        }).catch(function() {});
      }
    });
  }

  // ============ DEMO FUNNEL TRACKER ============
  if (type === 'demo-funnel') {
    var totalSteps = parseInt(script.getAttribute('data-total-steps') || '8', 10);
    var trackId = null, trackStart = Date.now(), stepEnterTime = Date.now();
    var stepTimes = {}, maxStepReached = 1, clickedInterested = false;

    // These will be set by the funnel code
    // window.GROWTHER_FUNNEL = { getCurrentStep, getAnswers }
    function getCurrentStep() { return (window.GROWTHER_FUNNEL && window.GROWTHER_FUNNEL.getCurrentStep) ? window.GROWTHER_FUNNEL.getCurrentStep() : 1; }
    function getAnswers() { return (window.GROWTHER_FUNNEL && window.GROWTHER_FUNNEL.getAnswers) ? window.GROWTHER_FUNNEL.getAnswers() : {}; }

    function getTrackPayload() {
      var cs = getCurrentStep();
      var now = Date.now(), key = 'step_' + cs;
      if (!stepTimes[key]) stepTimes[key] = 0;
      stepTimes[key] += Math.round((now - stepEnterTime) / 1000);
      stepEnterTime = now;
      var answers = getAnswers();
      return {
        website: window.location.pathname,
        stage: 'demo_funnel_view',
        linkedin: answers.email || null,
        extra_notes: JSON.stringify({
          time_on_page: Math.round((Date.now() - trackStart) / 1000),
          current_step: cs,
          max_step_reached: maxStepReached,
          step_times: stepTimes,
          completed_funnel: cs >= totalSteps,
          clicked_interested: clickedInterested,
          client: client,
          opened_at: new Date(trackStart).toISOString(),
          is_test: isAdmin
        }),
        last_step: clickedInterested ? 'interested' : 'step_' + cs,
        completed: clickedInterested
      };
    }

    function supaFetch(method, path, body) {
      return fetch(SU + '/rest/v1/' + path, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'apikey': SK, 'Authorization': 'Bearer ' + SK, 'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal' },
        body: JSON.stringify(body)
      });
    }

    // Initial insert
    supaFetch('POST', 'funnel_leads', getTrackPayload())
      .then(function(r) { return r.json(); })
      .then(function(data) { if (data && data[0]) trackId = data[0].id; });

    // Expose hooks for funnel code
    window.GROWTHER_TRACKER = {
      onStepChange: function(newStep) {
        if (newStep > maxStepReached) maxStepReached = newStep;
        if (trackId) supaFetch('PATCH', 'funnel_leads?id=eq.' + trackId, getTrackPayload());
      },
      onInterested: function() {
        clickedInterested = true;
        if (trackId) supaFetch('PATCH', 'funnel_leads?id=eq.' + trackId, getTrackPayload());
      }
    };

    // Periodic sync
    setInterval(function() {
      if (!trackId) return;
      supaFetch('PATCH', 'funnel_leads?id=eq.' + trackId, getTrackPayload());
    }, 10000);

    // Visibility change sync
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden' && trackId) {
        fetch(SU + '/rest/v1/funnel_leads?id=eq.' + trackId, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'apikey': SK, 'Authorization': 'Bearer ' + SK, 'Prefer': 'return=minimal' },
          body: JSON.stringify(getTrackPayload()), keepalive: true
        }).catch(function() {});
      }
    });
  }
})();
