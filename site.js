/* DNsuperclean — shared behaviour: year, mobile menu, nav dropdowns, gallery lightbox. */
(function () {
  'use strict';

  // ---- current year in footer ----
  document.querySelectorAll('.yr').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---- mobile menu ----
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open) closeAllDropdowns();
    });

    // any real link closes the menu
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        closeAllDropdowns();
      }
    });
  }

  // ---- nav dropdowns (click-toggle: works on touch and desktop) ----
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));

  function closeAllDropdowns(except) {
    items.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var t = item.querySelector('.nav-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  items.forEach(function (item) {
    var trigger = item.querySelector('.nav-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !item.classList.contains('is-open');
      closeAllDropdowns(item);
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) closeAllDropdowns();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeAllDropdowns();
    if (nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    }
  });

  // ---- gallery lightbox ----
  var box = document.getElementById('lightbox');
  if (box) {
    var big = box.querySelector('img');
    var cap = box.querySelector('.lightbox-cap');
    var lastFocus = null;

    document.querySelectorAll('.gallery figure').forEach(function (fig) {
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');

      function open() {
        var src = fig.querySelector('img');
        var text = fig.querySelector('figcaption');
        lastFocus = fig;
        big.src = src.currentSrc || src.src;
        big.alt = src.alt;
        cap.textContent = text ? text.textContent : '';
        box.classList.add('is-open');
        box.querySelector('.lightbox-close').focus();
      }

      fig.addEventListener('click', open);
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

    function closeBox() {
      if (!box.classList.contains('is-open')) return;
      box.classList.remove('is-open');
      big.removeAttribute('src'); // src="" would re-request the page URL
      if (lastFocus) lastFocus.focus();
    }

    box.addEventListener('click', closeBox);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBox(); });
  }

  // ---- quote form ----
  // No backend needed: the request is composed and handed to the phone's Messages app,
  // which lands straight on (813) 638-3518.
  // To use a real form service instead (Formspree, Web3Forms, Netlify), put its POST URL
  // here — the form will submit to it and skip the SMS handoff.
  var QUOTE_ENDPOINT = '';
  var QUOTE_PHONE = '+18136383518';

  var form = document.querySelector('.quote-form');
  if (form) {
    var panel = form.closest('.cta-panel');
    var sent = panel.querySelector('.form-sent');
    var sentMsg = panel.querySelector('.sent-msg');
    var errBox = form.querySelector('.form-error');

    function showError(msg, field) {
      errBox.textContent = msg;
      errBox.hidden = false;
      if (field) field.focus();
    }

    function compose(d) {
      var lines = [
        'Free quote request — DNsuperclean',
        '',
        'Service: ' + d.service,
        'Address / area: ' + d.address,
        'Phone: ' + d.phone
      ];
      if (d.details) lines.push('Details: ' + d.details);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errBox.hidden = true;

      var service = form.querySelector('#q-service');
      var address = form.querySelector('#q-address');
      var phone = form.querySelector('#q-phone');
      var details = form.querySelector('#q-details');

      if (!service.value) return showError('Please choose a service.', service);
      if (!address.value.trim()) return showError('Please add an address or area so we can quote it.', address);

      var digits = phone.value.replace(/\D/g, '');
      if (digits.length < 10) return showError('Please enter a phone number we can reach you on.', phone);

      var data = {
        service: service.value,
        address: address.value.trim(),
        phone: phone.value.trim(),
        details: details.value.trim()
      };
      var text = compose(data);

      function finish() {
        sentMsg.textContent = text;
        form.hidden = true;
        sent.hidden = false;
        sent.scrollIntoView({ block: 'center' });
      }

      if (QUOTE_ENDPOINT) {
        var btn = form.querySelector('button[type=submit]');
        btn.disabled = true;
        btn.textContent = 'Sending…';
        fetch(QUOTE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          sent.querySelector('h4').textContent = 'Request sent ✓';
          sent.querySelector('p').textContent =
            'Thanks — we have your details and will get back to you with a price.';
          finish();
        }).catch(function () {
          btn.disabled = false;
          btn.textContent = 'Send My Request';
          showError('That did not go through. Please call (813) 638-3518 instead.');
        });
        return;
      }

      // hand off to the phone's Messages app
      window.location.href = 'sms:' + QUOTE_PHONE + '?&body=' + encodeURIComponent(text);
      finish();
    });

    var copyBtn = panel.querySelector('[data-copy]');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var done = function () {
          copyBtn.textContent = 'Copied ✓';
          setTimeout(function () { copyBtn.textContent = 'Copy details'; }, 2000);
        };
        if (navigator.clipboard) {
          navigator.clipboard.writeText(sentMsg.textContent).then(done, function () {});
        } else {
          var r = document.createRange();
          r.selectNodeContents(sentMsg);
          var sel = getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
          try { document.execCommand('copy'); done(); } catch (err) {}
        }
      });
    }
  }

  // ---- videos: play on tap, pause the other one ----
  var videos = Array.prototype.slice.call(document.querySelectorAll('.video-card video'));
  videos.forEach(function (v) {
    v.addEventListener('play', function () {
      videos.forEach(function (o) { if (o !== v) o.pause(); });
    });
  });
})();
