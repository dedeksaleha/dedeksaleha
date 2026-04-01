// ===========================
// CURSOR
// ===========================
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = (mouseX - 5) + 'px';
  cursor.style.top  = (mouseY - 5) + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX - 15) * 0.12;
  ringY += (mouseY - ringY - 15) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Efek hover cursor
var hoverTargets = document.querySelectorAll('a, button, .card, .hobby-card, .gallery-item, .family-card, .contact-link');
hoverTargets.forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cursor.classList.add('hovered');
    cursorRing.classList.add('hovered');
  });
  el.addEventListener('mouseleave', function() {
    cursor.classList.remove('hovered');
    cursorRing.classList.remove('hovered');
  });
});


// ===========================
// SCROLL PROGRESS BAR
// ===========================
window.addEventListener('scroll', function() {
  var scrollBar = document.getElementById('scrollBar');
  var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
});


// ===========================
// REVEAL ON SCROLL
// ===========================
var revealEls = document.querySelectorAll('.reveal');
revealEls.forEach(function(el) {
  el.classList.add('hidden');
});

var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden');
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

revealEls.forEach(function(el) {
  revealObserver.observe(el);
});


// ===========================
// GALLERY
// ===========================
function showAlbums() {
  document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelector('.filter-btn[onclick="showAlbums()"]').classList.add('active');
  document.getElementById('albumGrid').style.display = 'grid';
  document.querySelectorAll('.album-detail').forEach(function(d) { d.classList.remove('visible'); });
}
function openAlbum(id) {
  document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
  var btn = document.querySelector('.filter-btn[onclick="openAlbum(\'' + id + '\')"]');
  if (btn) btn.classList.add('active');
  document.getElementById('albumGrid').style.display = 'none';
  document.querySelectorAll('.album-detail').forEach(function(d) { d.classList.remove('visible'); });
  document.getElementById('detail-' + id).classList.add('visible');
}
function backToAlbums() {
  showAlbums();
}


// ===========================
// CONTACT FORM
// ===========================
var contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = contactForm.querySelector('.btn-primary');
    var original = btn.textContent;
    btn.textContent = '✓ Terkirim!';
    btn.style.background = '#4a7c68';
    setTimeout(function() {
      btn.textContent = original;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ===========================
// HOBBIES
// ===========================
var audio = document.getElementById('audioPlayer');
var playBtn = document.getElementById('playBtn');
var progressFill = document.getElementById('progressFill');
var currentTimeEl = document.getElementById('currentTime');
var totalTimeEl = document.getElementById('totalTime');

function selectHobby(id, card) {
  document.querySelectorAll('.hobby-card').forEach(function(c) { c.classList.remove('active'); });
  document.querySelectorAll('.hobby-panel').forEach(function(p) { p.classList.remove('visible'); });
  card.classList.add('active');
  document.getElementById('panel-' + id).classList.add('visible');
  if (id !== 'musik' && audio) { audio.pause(); playBtn.textContent = '▶'; }
}

function togglePlay(e) {
  e.stopPropagation();
  if (audio.paused) { audio.play(); playBtn.textContent = '⏸'; }
  else { audio.pause(); playBtn.textContent = '▶'; }
}

function seekAudio(e) {
  var rect = e.currentTarget.getBoundingClientRect();
  var pct = (e.clientX - rect.left) / rect.width;
  if (audio.duration) audio.currentTime = pct * audio.duration;
}

function fmt(s) {
  var m = Math.floor(s / 60);
  var sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

if (audio) {
  audio.addEventListener('timeupdate', function() {
    if (audio.duration) {
      progressFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
      currentTimeEl.textContent = fmt(audio.currentTime);
    }
  });
  audio.addEventListener('loadedmetadata', function() {
    totalTimeEl.textContent = fmt(audio.duration);
  });
  audio.addEventListener('ended', function() { playBtn.textContent = '▶'; });
}