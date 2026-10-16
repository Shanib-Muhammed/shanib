/* Shared storage that connects index.html (proposal) and admin.html (admin).
   1) Paste your Supabase URL and anon key below to share answers across devices.
   2) Leave them empty for demo mode: works only in the same browser. */
var Store = (function () {
  var SUPABASE_URL = '';   // e.g. https://abcd1234.supabase.co
  var SUPABASE_KEY = '';   // your anon public key
  var LS = 'proposal_events';
  var shared = !!(SUPABASE_URL && SUPABASE_KEY);

  function headers() {
    return { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json' };
  }
  function save(type, who) {
    var row = { type: type, who: who || '', t: Date.now() };
    if (shared) {
      fetch(SUPABASE_URL + '/rest/v1/events', { method: 'POST', headers: headers(), body: JSON.stringify(row) }).catch(function () {});
    } else {
      try {
        var a = JSON.parse(localStorage.getItem(LS) || '[]');
        a.push(row);
        localStorage.setItem(LS, JSON.stringify(a));
      } catch (e) {}
    }
  }
  function load() {
    if (shared) {
      return fetch(SUPABASE_URL + '/rest/v1/events?select=*&order=t.desc&limit=100', { headers: headers() })
        .then(function (r) { return r.json(); });
    }
    try { return Promise.resolve(JSON.parse(localStorage.getItem(LS) || '[]')); }
    catch (e) { return Promise.resolve([]); }
  }
  return { save: save, load: load, shared: shared };
})();
