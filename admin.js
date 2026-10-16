var $ = function (i) { return document.getElementById(i); };
var PASSWORD = 'password';   // change this
var timer;

function login() {
  if ($('pw').value === PASSWORD) {
    $('gate').classList.add('hide');
    $('panel').classList.remove('hide');
    $('mode').textContent = Store.shared ? '' : 'Demo mode: answers show only from this same browser. Add Supabase keys in store.js.';
    refresh();
    timer = setInterval(refresh, 5000);
  } else {
    $('gerr').textContent = 'Wrong password. Try again.';
  }
}

function refresh() {
  Store.load().then(paint).catch(function () { $('st').textContent = 'Could not load answers.'; });
}

function paint(ev) {
  ev = (ev || []).slice().sort(function (a, b) { return b.t - a.t; });
  var yes = ev.filter(function (e) { return e.type === 'yes'; });
  var no = ev.filter(function (e) { return e.type === 'no'; }).length;
  var seen = ev.filter(function (e) { return e.type === 'view'; }).length;
  $('st').textContent = yes.length ? 'YES 💖 ' + (yes[0].who || '') : (seen ? 'She opened it, no answer yet' : 'Waiting for her…');
  $('cnt').textContent = 'Opened: ' + seen + '   ·   Tried to press No: ' + no + '   ·   Yes: ' + yes.length;
  var L = $('log'); L.textContent = '';
  var label = { yes: 'said Yes 💖', no: 'tried No', view: 'opened the page' };
  ev.slice(0, 15).forEach(function (e) {
    var li = document.createElement('li');
    li.textContent = new Date(e.t).toLocaleString() + '  ' + (e.who || 'Someone') + ' ' + label[e.type];
    L.appendChild(li);
  });
}

$('login').addEventListener('click', login);
$('pw').addEventListener('keydown', function (e) { if (e.key === 'Enter') login(); });
$('refresh').addEventListener('click', refresh);
