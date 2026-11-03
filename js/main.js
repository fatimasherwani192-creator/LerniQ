(function () {
  var script = document.currentScript;
  var root = script.getAttribute('data-root') || '';
  var SITE = ['Learni', 'Q'];

  // To add a page: add one line here, then create the HTML file.
  var NAV = [
    { title: 'Overview', items: [
      { id: 'home', label: 'Home', href: 'index.html' },
      { id: 'problem-statement', label: 'Problem statement', href: '01-overview/problem-statement.html' },
      { id: 'solution', label: 'Solution', href: '01-overview/solution.html' },
      { id: 'key-features', label: 'Key features', href: '01-overview/key-features.html' }
    ]},
    { title: 'Users and roles', items: [
      { id: 'super-admin', label: 'Super Admin', href: '02-users-roles/super-admin.html' },
      { id: 'admin', label: 'Admin', href: '02-users-roles/admin.html' },
      { id: 'teacher', label: 'Teacher', href: '02-users-roles/teacher.html' },
      { id: 'student', label: 'Student', href: '02-users-roles/student.html' }
    ]}
  ];

  var current = document.body.getAttribute('data-page');
  var flat = [];
  NAV.forEach(function (g) { g.items.forEach(function (i) { flat.push(i); }); });

  var saved = null;
  try { saved = localStorage.getItem('sg-theme'); } catch (e) {}
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  var main = document.getElementById('content');
  var shell = document.createElement('div');
  shell.className = 'shell';
  main.parentNode.insertBefore(shell, main);

  var side = document.createElement('nav');
  side.className = 'side';
  side.setAttribute('aria-label', 'Documentation');
  NAV.forEach(function (g) {
    var h = document.createElement('h4');
    h.textContent = g.title;
    side.appendChild(h);
    g.items.forEach(function (i) {
      var a = document.createElement('a');
      a.href = root + i.href;
      a.textContent = i.label;
      if (i.id === current) { a.className = 'active'; a.setAttribute('aria-current', 'page'); }
      a.addEventListener('click', function () { document.body.classList.remove('open'); });
      side.appendChild(a);
    });
  });
  shell.appendChild(side);
  shell.appendChild(main);

  var bar = document.createElement('header');
  bar.className = 'topbar';
  bar.innerHTML =
    '<button class="btn" id="menuBtn" aria-label="Open menu">Menu</button>' +
    '<a class="brand" href="' + root + 'index.html" aria-label="LearniQ Docs"><span class="brand-mark" aria-hidden="true">LQ</span>' + SITE[0] + '<span>' + SITE[1] + '</span> Docs</a>' +
    '<button class="btn" id="themeBtn" aria-label="Toggle dark mode">Dark mode</button>';
  document.body.insertBefore(bar, shell);

  document.getElementById('menuBtn').addEventListener('click', function () {
    document.body.classList.toggle('open');
  });
  document.getElementById('themeBtn').addEventListener('click', function () {
    var el = document.documentElement;
    var dark = el.getAttribute('data-theme') === 'dark' ||
      (!el.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var next = dark ? 'light' : 'dark';
    el.setAttribute('data-theme', next);
    try { localStorage.setItem('sg-theme', next); } catch (e) {}
  });

  var idx = -1;
  flat.forEach(function (p, n) { if (p.id === current) idx = n; });
  if (idx > -1) {
    var pager = document.createElement('div');
    pager.className = 'pager';
    var prev = flat[idx - 1], next = flat[idx + 1];
    pager.innerHTML =
      (prev ? '<a href="' + root + prev.href + '">&larr; ' + prev.label + '</a>' : '<span></span>') +
      (next ? '<a href="' + root + next.href + '">' + next.label + ' &rarr;</a>' : '<span></span>');
    main.appendChild(pager);
  }
})();
