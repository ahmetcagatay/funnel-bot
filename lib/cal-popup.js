// Growther AI - Cal.com Popup
// Usage: window.showCalPopup('tr') or window.showCalPopup('en')

window.showCalPopup = function(lang) {
  lang = lang || 'tr';
  var isEn = lang === 'en';
  var calLink = (window.GROWTHER && GROWTHER.CAL_LINK) || 'https://cal.com/ahmetcagatay/15min';

  // Track cal click
  if (window.GROWTHER && GROWTHER.supaFetch) {
    var client = window.location.pathname.split('/')[1] || 'unknown';
    GROWTHER.supaFetch('POST', 'funnel_leads', {
      website: window.location.pathname,
      stage: 'cal_click',
      extra_notes: JSON.stringify({ client: client, action: 'cal_booking_popup', clicked_at: new Date().toISOString(), is_test: GROWTHER.isAdmin }),
      last_step: 'cal_booking',
      completed: true
    }).catch(function() {});
  }

  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;animation:grCalFadeIn .3s ease';

  var modal = document.createElement('div');
  // Detect theme from page
  var bgColor = '#1e293b';
  var textColor = '#f1f5f9';
  var subColor = '#94a3b8';
  var mutedColor = '#64748b';
  var accentColor = '#22c55e';
  var accentGradient = 'linear-gradient(135deg,#22c55e,#16a34a)';
  var accentShadow = 'rgba(34,197,94,0.4)';

  // Try to detect purple theme
  var rootBg = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '';
  if (rootBg.indexOf('2e') !== -1 || rootBg.indexOf('1a0a') !== -1) {
    bgColor = '#2d1b4e'; textColor = '#f5f0ff'; subColor = '#b8a5d4'; mutedColor = '#8b7aaa';
    accentColor = '#a855f7'; accentGradient = 'linear-gradient(135deg,#a855f7,#7c3aed)'; accentShadow = 'rgba(168,85,247,0.4)';
  }

  modal.style.cssText = 'background:' + bgColor + ';border-radius:24px;padding:32px 24px;max-width:400px;width:100%;text-align:center;position:relative;animation:grCalScaleUp .4s cubic-bezier(.34,1.56,.64,1)';

  var style = document.createElement('style');
  style.textContent = '@keyframes grCalFadeIn{from{opacity:0}to{opacity:1}}@keyframes grCalScaleUp{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}';
  document.head.appendChild(style);

  var emoji = document.createElement('div');
  emoji.style.cssText = 'font-size:48px;margin-bottom:16px';
  emoji.textContent = '\uD83D\uDCC5';

  var title = document.createElement('h2');
  title.style.cssText = 'color:' + textColor + ';font-size:22px;font-weight:700;margin-bottom:8px;font-family:Inter,-apple-system,sans-serif';
  title.textContent = isEn ? 'Let\u2019s jump on a quick call!' : 'Hemen bir g\u00F6r\u00FC\u015Fme ayarlayal\u0131m!';

  var desc = document.createElement('p');
  desc.style.cssText = 'color:' + subColor + ';font-size:14px;line-height:1.5;margin-bottom:24px;font-family:Inter,-apple-system,sans-serif';
  desc.textContent = isEn ? '15 minutes to discuss your growth strategy. Pick a time that works for you.' : '15 dakikada b\u00FCy\u00FCme stratejinizi konu\u015Fal\u0131m. Size uygun bir zaman se\u00E7in.';

  var btn = document.createElement('a');
  btn.href = calLink;
  btn.target = '_blank';
  btn.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:56px;background:' + accentGradient + ';color:#fff;border:none;border-radius:16px;font-family:Inter,-apple-system,sans-serif;font-size:17px;font-weight:700;text-decoration:none;cursor:pointer;box-shadow:0 4px 20px ' + accentShadow + ';transition:transform .2s,box-shadow .2s';
  btn.textContent = isEn ? '\u2705 Book My 15-Min Call' : '\u2705 15 Dakika G\u00F6r\u00FC\u015Fme Se\u00E7';
  btn.onmouseover = function() { btn.style.transform = 'translateY(-2px)'; };
  btn.onmouseout = function() { btn.style.transform = 'translateY(0)'; };

  var dismiss = document.createElement('button');
  dismiss.style.cssText = 'background:none;border:none;color:' + mutedColor + ';font-size:13px;font-family:Inter,-apple-system,sans-serif;cursor:pointer;margin-top:16px;padding:8px';
  dismiss.textContent = isEn ? 'Maybe later' : 'Daha sonra';
  dismiss.onclick = function() { overlay.remove(); };

  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  modal.appendChild(emoji);
  modal.appendChild(title);
  modal.appendChild(desc);
  modal.appendChild(btn);
  modal.appendChild(dismiss);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
};
