/* ============================================================================
   Nitamur Ad Caelum Ltd — site.js
   Render logic, observers, motion and the enquiry form.
   Depends on site.data.js (loaded first): GROUP, SECTORS, SUBSIDIARIES,
   GROUP_STATS, ENQUIRER_TYPES, WEB3FORMS_KEY.
   No framework, no build step. Runs from file:// and any static host.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- small helpers ---------------------------------------------------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (attrs[k] != null && attrs[k] !== false) {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  /* A value is a placeholder if it is null/empty or carries the [[ ... ]]
     confirm marker. Placeholders must always render visibly unfinished. */
  function isPlaceholder(v) {
    return v == null || v === '' ||
      (typeof v === 'string' && v.indexOf('[[') !== -1);
  }
  function keyMissing() { return WEB3FORMS_KEY.indexOf('<<') !== -1 || WEB3FORMS_KEY === ''; }

  function chevronTickSVG(cls) {
    return '<svg viewBox="0 0 64 22" fill="none" aria-hidden="true" class="' + (cls || '') +
      '"><path d="M32 4 L60 22 L48 22 L32 12 L16 22 L4 22 Z" fill="currentColor"/></svg>';
  }

  /* Render a placeholder inline element. */
  function placeholder(text) {
    return el('span', { class: 'placeholder', text: text || '— to confirm' });
  }

  /* ====================================================================== */
  /*  NAV — subsidiary/sector anchor links (desktop + mobile)               */
  /* ====================================================================== */
  function buildNav() {
    var desktop = document.getElementById('nav-links');
    var mobile = document.getElementById('mobile-nav-links');

    SECTORS.forEach(function (s) {
      if (desktop) {
        desktop.appendChild(el('a', {
          href: '#sector-' + s.id,
          class: 'text-offwhite/85 hover:text-offwhite transition-colors text-sm font-normal',
          'data-nav': s.id
        }, [s.label]));
      }
      if (mobile) {
        mobile.appendChild(el('a', {
          href: '#sector-' + s.id, 'data-mobile-link': '1'
        }, [
          el('span', { class: 'tick', html: chevronTickSVG(), 'aria-hidden': 'true' }),
          s.label
        ]));
      }
    });

    if (mobile) {
      mobile.appendChild(el('a', { href: '#contact', 'data-mobile-link': '1' }, [
        el('span', { class: 'tick', html: chevronTickSVG(), 'aria-hidden': 'true' }),
        'Contact'
      ]));
    }
  }

  /* ====================================================================== */
  /*  PROGRESS RAIL — five chevron ticks, one per sector                    */
  /* ====================================================================== */
  function buildRail() {
    var rail = document.getElementById('rail');
    if (!rail) return;
    SECTORS.forEach(function (s, i) {
      var btn = el('button', {
        class: 'rail-tick',
        type: 'button',
        'data-rail': s.id,
        'aria-label': 'Go to ' + s.label + ' (' + (i + 1) + ' of ' + SECTORS.length + ')',
        onClick: function () {
          var target = document.getElementById('sector-' + s.id);
          if (target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
        }
      }, []);
      btn.innerHTML += chevronTickSVG();
      btn.appendChild(el('span', { class: 'rail-label', 'aria-hidden': 'true', text: s.label }));
      rail.appendChild(btn);
    });
  }

  /* ====================================================================== */
  /*  GROUP STATS — count-up strip                                          */
  /* ====================================================================== */
  function buildStats() {
    var wrap = document.getElementById('group-stats');
    if (!wrap) return;
    GROUP_STATS.forEach(function (stat) {
      var valueNode;
      if (isPlaceholder(stat.value)) {
        // Safety net only — all four stats are confirmed. Kept so an unknown
        // value can never silently render as a real figure.
        valueNode = el('span', { class: 'placeholder text-lg text-sage-bright' }, ['[[ confirm ]]']);
      } else if (stat.key === 'founded') {
        // A year is not a quantity — render it static, never count from zero.
        valueNode = el('span', {
          class: 'block text-5xl sm:text-6xl brand-nac text-offwhite tabular-nums'
        }, [String(stat.value)]);
      } else {
        valueNode = el('span', {
          class: 'block text-5xl sm:text-6xl brand-nac text-offwhite tabular-nums',
          'data-countup': String(stat.value)
        }, [prefersReduced ? String(stat.value) : '0']);
      }
      wrap.appendChild(el('div', { class: 'reveal' }, [
        valueNode,
        el('span', { class: 'eyebrow block mt-3 text-sage-bright' }, [stat.label])
      ]));
    });
  }

  function runCountUps() {
    var nodes = document.querySelectorAll('[data-countup]');
    nodes.forEach(function (node) {
      var target = parseInt(node.getAttribute('data-countup'), 10);
      if (prefersReduced || isNaN(target)) { node.textContent = String(target || 0); return; }
      var start = null, dur = 1100;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = String(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
        else node.textContent = String(target);
      }
      requestAnimationFrame(step);
    });
  }

  /* ====================================================================== */
  /*  SUBSIDIARIES — five sector blocks, alternating left/right             */
  /* ====================================================================== */
  function statusBadge(status) {
    // Status is stored as data ('operating' / 'in development'); the display
    // label is presentation only and mapped here.
    var s = (status || '').toLowerCase();
    var operating = s.indexOf('operating') !== -1;
    return el('span', {
      class: 'badge ' + (operating ? 'badge-operating' : 'badge-dev')
    }, [operating ? 'Operating' : 'Launching soon']);
  }

  function subsidiaryLogo(sub) {
    // Logo graphic. If the file is absent/fails, the slot collapses and the
    // <h4> name below carries the brand as its Sora-800 fallback — no
    // duplicated wordmark, no invented graphic.
    if (isPlaceholder(sub.name) || isPlaceholder(sub.logo)) {
      return null;
    }
    var img = el('img', {
      src: sub.logo,
      alt: sub.name + ' logo',
      class: 'h-12 w-auto object-contain object-left mb-1',
      loading: 'lazy',
      decoding: 'async'
    });
    var box = el('div', { class: 'flex items-center' }, [img]);
    img.addEventListener('error', function () { box.remove(); });
    return box;
  }

  function subsidiaryCard(sub) {
    var body = [];
    var unnamed = isPlaceholder(sub.name);

    body.push(el('div', { class: 'flex items-center justify-end gap-4 mb-5' }, [
      statusBadge(sub.status)
    ]));

    // Unnamed subsidiary: a deliberately quiet "coming" card. No wordmark,
    // no chips, no link — nothing that could read as a trading entity.
    if (unnamed) {
      body.push(el('p', { class: 'mt-5 eyebrow text-forest/45' }, ['Future subsidiary']));
      body.push(el('h4', { class: 'mt-2 text-2xl brand-nac text-forest/45' }, ['Coming 2026']));
      body.push(el('p', { class: 'mt-3 text-forest/60 leading-relaxed' },
        [isPlaceholder(sub.tagline) ? 'Details announced on launch.' : sub.tagline]));
      body.push(el('p', { class: 'mt-4 text-sm text-forest/45 italic' },
        ['The group is establishing this business. Its name and details will be published when it opens.']));
      return el('article', {
        class: 'reveal rounded-2xl p-7 sm:p-8 border border-dashed border-forest/25 bg-forest/[0.02] ' +
          'h-full flex flex-col'
      }, body);
    }

    body.push(subsidiaryLogo(sub));

    body.push(el('h4', {
      class: 'mt-5 text-2xl brand-nac text-forest'
    }, [sub.name]));

    // Tagline
    body.push(el('p', { class: 'mt-1 text-tagline font-semibold' },
      isPlaceholder(sub.tagline) ? [placeholder('tagline — to confirm')] : [sub.tagline]));

    // Description
    if (isPlaceholder(sub.description)) {
      body.push(el('div', { class: 'placeholder-block mt-4 text-sm' },
        ['Description not yet confirmed — will be added before launch.']));
    } else {
      body.push(el('p', { class: 'mt-4 text-forest/80 leading-relaxed' }, [sub.description]));
    }

    // Capability chips
    if (sub.capabilities && sub.capabilities.length) {
      var chips = el('div', { class: 'mt-5 flex flex-wrap gap-2' }, []);
      sub.capabilities.forEach(function (c) { chips.appendChild(el('span', { class: 'chip' }, [c])); });
      body.push(chips);
    }

    // Proof points — only render when genuinely present; never invent.
    if (sub.proofPoints && sub.proofPoints.length) {
      var proofs = el('ul', { class: 'mt-5 space-y-1 text-sm text-forest/75' }, []);
      sub.proofPoints.forEach(function (p) {
        proofs.appendChild(el('li', { class: 'flex gap-2' }, [
          el('span', { class: 'text-sage', html: chevronTickSVG(), 'aria-hidden': 'true' }), p
        ]));
      });
      body.push(proofs);
    }

    // Link to own site
    if (!isPlaceholder(sub.link)) {
      body.push(el('a', {
        href: sub.link,
        class: 'mt-6 inline-flex items-center gap-2 font-semibold text-forest hover:text-forest-deep group',
        target: '_blank',
        rel: 'noopener'
      }, [
        'Visit ' + sub.name,
        el('span', { 'aria-hidden': 'true', class: 'transition-transform group-hover:translate-x-1' }, ['→'])
      ]));
    } else if (sub.status && sub.status.toLowerCase().indexOf('operating') === -1) {
      body.push(el('p', { class: 'mt-6 text-sm text-forest/50 italic' }, ['Site opening once the business is live.']));
    }

    return el('article', {
      class: 'reveal bg-white rounded-2xl p-7 sm:p-8 shadow-sm ring-1 ring-forest/5 h-full flex flex-col'
    }, body);
  }

  /* A partner card, shown inside its sector block. Partners are not owned by
     the group; future partners get the same quiet, muted treatment as a
     "coming" subsidiary, but keep their real name, logo and profile. */
  function partnerCard(p) {
    var future = (p.status || '').toLowerCase() === 'future';
    var body = [];

    body.push(el('div', { class: 'flex items-center justify-between gap-4 mb-5' }, [
      el('span', { class: 'eyebrow text-tagline' }, ['Partner']),
      el('span', { class: 'badge badge-dev' }, [future ? 'Coming 2026' : 'Partner'])
    ]));

    var logo = subsidiaryLogo(p);   // null-safe: name fallback when no logo
    if (logo) body.push(logo);

    body.push(el('h4', { class: 'mt-5 text-2xl brand-nac text-forest' }, [p.name]));

    if (!isPlaceholder(p.tagline)) {
      body.push(el('p', { class: 'mt-1 text-tagline font-semibold' }, [p.tagline]));
    }
    if (!isPlaceholder(p.description)) {
      body.push(el('p', { class: 'mt-4 text-forest/75 leading-relaxed' }, [p.description]));
    }
    if (p.regions && p.regions.length) {
      var chips = el('div', { class: 'mt-5 flex flex-wrap gap-2' }, []);
      p.regions.forEach(function (r) { chips.appendChild(el('span', { class: 'chip' }, [r])); });
      body.push(chips);
    }
    if (!isPlaceholder(p.link)) {
      body.push(el('a', {
        href: p.link, target: '_blank', rel: 'noopener',
        class: 'mt-6 inline-flex items-center gap-2 font-semibold text-forest hover:text-forest-deep group'
      }, [
        'Visit ' + p.name,
        el('span', { 'aria-hidden': 'true', class: 'transition-transform group-hover:translate-x-1' }, ['→'])
      ]));
    } else if (future) {
      body.push(el('p', { class: 'mt-6 text-sm text-forest/50 italic' },
        ['A future partner — joining the group’s network in 2026.']));
    }

    return el('article', {
      class: 'reveal rounded-2xl p-7 sm:p-8 h-full flex flex-col ' +
        (future ? 'border border-dashed border-forest/25 bg-forest/[0.02]'
                : 'bg-white shadow-sm ring-1 ring-forest/5')
    }, body);
  }

  function buildSubsidiaries() {
    var host = document.getElementById('sectors');
    if (!host) return;
    var allPartners = (typeof PARTNERS !== 'undefined') ? PARTNERS : [];

    SECTORS.forEach(function (sector, si) {
      var subs = SUBSIDIARIES.filter(function (s) { return s.sector === sector.id; });
      var parts = allPartners.filter(function (p) { return p.sector === sector.id; });
      var reversed = si % 2 === 1;
      var total = subs.length + parts.length;
      var ci = 0;

      var cardsWrap = el('div', {
        class: 'grid gap-6 ' + (total > 1 ? 'sm:grid-cols-2' : 'sm:grid-cols-1')
      }, []);

      subs.forEach(function (sub) {
        var card = subsidiaryCard(sub);
        card.style.transitionDelay = (ci * 0.08) + 's'; ci++;
        cardsWrap.appendChild(card);
      });
      parts.forEach(function (p) {
        var card = partnerCard(p);
        card.style.transitionDelay = (ci * 0.08) + 's'; ci++;
        cardsWrap.appendChild(card);
      });

      var introSub;
      if (subs.length && parts.length) {
        introSub = 'The business and partner in this sector.';
      } else if (parts.length) {
        introSub = parts.length > 1
          ? 'The partners the group works with in this sector.'
          : 'The partner the group works with in this sector.';
      } else {
        introSub = subs.length > 1
          ? 'Two businesses the group backs in this sector.'
          : 'The business the group backs in this sector.';
      }

      var intro = el('div', { class: 'lg:col-span-2 reveal' }, [
        el('p', { class: 'eyebrow text-tagline' }, [sector.label]),
        el('h3', { class: 'mt-3 text-3xl sm:text-4xl brand-nac text-forest' }, [
          sector.label === 'Healthcare' ? 'Care, delivered with dignity'
            : sector.label === 'Logistics' ? 'Moving goods, reliably'
            : sector.label === 'Software' ? 'Software built to last'
            : sector.label.indexOf('NGO') !== -1 ? 'Partnerships that deliver'
            : 'Print at scale'
        ]),
        el('p', { class: 'mt-3 text-forest/70 max-w-xl' }, [introSub])
      ]);

      // Layout: intro column + cards column, alternating side.
      var block = el('div', {
        id: 'sector-' + sector.id,
        class: 'grid lg:grid-cols-5 gap-8 lg:gap-12 items-start scroll-mt-28 ' +
          (si + 1 < SECTORS.length ? 'mb-20 sm:mb-28' : '')
      }, []);

      var introCol = el('div', { class: 'lg:col-span-2 ' + (reversed ? 'lg:order-2' : '') }, [intro]);
      var cardsCol = el('div', { class: 'lg:col-span-3 ' + (reversed ? 'lg:order-1' : '') }, [cardsWrap]);
      block.appendChild(introCol);
      block.appendChild(cardsCol);
      host.appendChild(block);
    });
  }

  /* ====================================================================== */
  /*  REACH — the group's four regions, from REGIONS                        */
  /*  Typographic treatment (Sora 600, uppercase, 0.22em) with chevron      */
  /*  ticks. Country silhouettes were intentionally NOT drawn: accurate,    */
  /*  projection-consistent public-domain geometry could not be sourced and */
  /*  verified here, and a wrong-shaped outline is worse than none for a    */
  /*  government/NGO audience. See README for how to add verified outlines. */
  /* ====================================================================== */
  function buildReach() {
    var host = document.getElementById('reach-list');
    if (!host) return;
    var regions = (typeof REGIONS !== 'undefined' && REGIONS.length)
      ? REGIONS.slice()
      : [];

    if (!regions.length) {
      host.appendChild(el('p', {
        class: 'placeholder-block text-offwhite/70',
        style: 'border-color:rgba(169,205,182,0.5);background:none;'
      }, ['Regions of operation not yet confirmed across the group.']));
      return;
    }

    regions.forEach(function (r) {
      host.appendChild(el('li', {
        class: 'reveal flex items-center gap-4 py-5 border-b border-sage/20 list-none'
      }, [
        el('span', {
          class: 'text-sage flex-none',
          html: '<svg viewBox="0 0 64 22" width="34" fill="currentColor" aria-hidden="true">' +
                '<path d="M32 4 L60 22 L48 22 L32 12 L16 22 L4 22 Z"/></svg>'
        }),
        el('span', {
          class: 'text-offwhite text-xl sm:text-2xl font-semibold uppercase',
          style: 'letter-spacing:0.22em;'
        }, [r])
      ]));
    });
  }

  /* ====================================================================== */
  /*  ENQUIRY FORM                                                          */
  /* ====================================================================== */
  function buildForm() {
    var form = document.getElementById('enquiry-form');
    if (!form) return;

    // access key
    var keyInput = form.querySelector('input[name="access_key"]');
    if (keyInput) keyInput.value = keyMissing() ? '' : WEB3FORMS_KEY;

    // enquirer-type options
    var enquirerSelect = form.querySelector('#f-enquirer');
    ENQUIRER_TYPES.forEach(function (t) {
      enquirerSelect.appendChild(el('option', { value: t.label }, [t.label]));
    });

    // subsidiary-of-interest options
    var subSelect = form.querySelector('#f-subsidiary');
    SUBSIDIARIES.forEach(function (s) {
      var label = isPlaceholder(s.name) ? (labelForSector(s.sector) + ' (name to be confirmed)') : s.name;
      subSelect.appendChild(el('option', { value: label }, [label]));
    });
    subSelect.appendChild(el('option', { value: 'Group / not sure' }, ['Group / not sure']));

    // conditional follow-up
    var followWrap = document.getElementById('f-followup');
    enquirerSelect.addEventListener('change', function () {
      renderFollowUp(followWrap, enquirerSelect.value);
    });

    // not-connected notice
    if (keyMissing()) {
      var notice = document.getElementById('form-key-notice');
      if (notice) notice.hidden = false;
    }

    form.addEventListener('submit', onSubmit);
  }

  function labelForSector(id) {
    var s = SECTORS.filter(function (x) { return x.id === id; })[0];
    return s ? s.label : 'Subsidiary';
  }

  function renderFollowUp(wrap, enquirerLabel) {
    wrap.innerHTML = '';
    var entry = ENQUIRER_TYPES.filter(function (t) { return t.label === enquirerLabel; })[0];
    if (!entry || !entry.followUp) return;
    var f = entry.followUp;
    var id = 'f-' + f.name;
    var label = el('label', { for: id, class: 'block eyebrow text-offwhite/60 mb-2' }, [f.label]);

    var control;
    if (f.type === 'select') {
      control = el('select', { id: id, name: f.name, class: fieldClass() }, []);
      control.appendChild(el('option', { value: '' }, ['Select…']));
      (f.options || []).forEach(function (o) { control.appendChild(el('option', { value: o }, [o])); });
    } else {
      control = el('input', { id: id, name: f.name, type: 'text', class: fieldClass() });
    }
    wrap.appendChild(el('div', { class: 'reveal is-visible' }, [label, control]));
  }

  function fieldClass() {
    // Matches the dark contact-form fields.
    return 'w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-offwhite ' +
      'placeholder-offwhite/40 focus:border-sage outline-none transition-colors';
  }

  /* ---- validation ------------------------------------------------------- */
  function setError(field, msg) {
    var errEl = document.getElementById(field.getAttribute('aria-describedby'));
    field.setAttribute('aria-invalid', 'true');
    if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
  }
  function clearError(field) {
    var errEl = document.getElementById(field.getAttribute('aria-describedby'));
    field.setAttribute('aria-invalid', 'false');
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
  }

  function validate(form) {
    var ok = true, firstBad = null;
    function fail(f, msg) { setError(f, msg); if (!firstBad) firstBad = f; ok = false; }

    var name = form.querySelector('#f-name');
    var email = form.querySelector('#f-email');
    var enquirer = form.querySelector('#f-enquirer');
    var message = form.querySelector('#f-message');
    var consent = form.querySelector('#f-consent');

    [name, email, enquirer, message].forEach(clearError);
    clearError(consent);

    if (!name.value.trim()) fail(name, 'Enter your full name so we know who is getting in touch.');
    if (!email.value.trim()) fail(email, 'Enter your email so we can reply.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
      fail(email, 'That email address is missing an @ or a domain. Check and try again.');
    if (!enquirer.value) fail(enquirer, 'Tell us which of these best describes you.');
    if (!message.value.trim()) fail(message, 'Add a short message telling us what you need.');
    else if (message.value.trim().length < 20)
      fail(message, 'A little more detail helps — please write at least 20 characters.');
    if (!consent.checked) fail(consent, 'Please confirm we can contact you about this enquiry.');

    if (firstBad) firstBad.focus();
    return ok;
  }

  /* ---- submit ----------------------------------------------------------- */
  function onSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    if (!validate(form)) return;

    var btn = form.querySelector('#f-submit');
    var btnLabel = btn.querySelector('.btn-label');
    var original = btnLabel.textContent;

    // Honeypot filled -> silently treat as spam success.
    var honey = form.querySelector('input[name="botcheck"]');
    if (honey && honey.checked) { showSuccess(form); return; }

    if (keyMissing()) {
      // Wired but not connected — never fail silently.
      showNotConnected(form);
      return;
    }

    btn.disabled = true;
    btnLabel.textContent = 'Sending…';
    btn.querySelector('.spinner').hidden = false;

    var data = new FormData(form);
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j && res.j.success) { showSuccess(form); }
        else { showError(form, res.j && res.j.message); }
      })
      .catch(function () { showError(form); })
      .then(function () {
        btn.disabled = false;
        btnLabel.textContent = original;
        btn.querySelector('.spinner').hidden = true;
      });
  }

  function panel(cls, children) {
    return el('div', {
      class: 'rounded-2xl p-8 ' + cls, role: 'status', 'aria-live': 'polite', tabindex: '-1'
    }, children);
  }

  function showSuccess(form) {
    var p = panel('bg-sage/15 ring-1 ring-sage/40', [
      el('div', { class: 'text-sage-bright mb-4', html: chevronTickSVG(), 'aria-hidden': 'true' }),
      el('h3', { class: 'text-2xl brand-nac text-offwhite' }, ['Enquiry sent']),
      el('p', { class: 'mt-3 text-offwhite/85' }, [
        'Thank you — your enquiry has reached Nitamur Ad Caelum Ltd. ' +
        'We read every message and a member of the group will reply, usually within two working days.'
      ]),
      el('p', { class: 'mt-3 text-offwhite/70 text-sm' }, [
        'Need us sooner? Email ',
        el('a', { href: 'mailto:' + GROUP.email, class: 'underline text-sage-bright' }, [GROUP.email]), '.'
      ])
    ]);
    form.replaceWith(p);
    p.focus();
  }

  function showNotConnected(form) {
    var box = document.getElementById('form-inflight-message');
    if (!box) return;
    box.innerHTML = '';
    box.hidden = false;
    box.appendChild(el('div', {
      class: 'rounded-xl p-5 bg-amber-100/10 ring-1 ring-amber-300/40 text-offwhite'
    }, [
      el('p', { class: 'font-semibold text-amber-200' }, ['Form not yet connected']),
      el('p', { class: 'mt-2 text-offwhite/85 text-sm' }, [
        'The enquiry form passed validation but the Web3Forms access key has not been ' +
        'added yet, so nothing was sent. In the meantime, email us directly at ',
        el('a', { href: 'mailto:' + GROUP.email, class: 'underline text-sage-bright' }, [GROUP.email]),
        ' and we will pick it up.'
      ])
    ]));
    box.focus();
  }

  function showError(form, message) {
    var box = document.getElementById('form-inflight-message');
    if (!box) return;
    box.innerHTML = '';
    box.hidden = false;
    box.appendChild(el('div', {
      class: 'rounded-xl p-5 bg-red-900/25 ring-1 ring-red-400/40 text-offwhite'
    }, [
      el('p', { class: 'font-semibold text-red-200' }, ['Your enquiry did not send']),
      el('p', { class: 'mt-2 text-offwhite/85 text-sm' }, [
        message || 'The connection to our form service failed. Check you are online and press ' +
        'Send enquiry again. If it keeps failing, email us at ',
        el('a', { href: 'mailto:' + GROUP.email, class: 'underline text-sage-bright' }, [GROUP.email]),
        ' and we will respond.'
      ])
    ]));
    box.focus();
  }

  /* ====================================================================== */
  /*  HEADER, MOBILE NAV, SCROLL STATE, RAIL, REVEALS                       */
  /* ====================================================================== */
  function wireHeader() {
    var header = document.getElementById('site-header');
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function wireMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var overlay = document.getElementById('mobile-nav');
    var closeBtn = document.getElementById('mobile-nav-close');
    if (!toggle || !overlay) return;
    var lastFocus = null;

    function focusables() {
      return Array.prototype.slice.call(
        overlay.querySelectorAll('a[href], button:not([disabled])'));
    }
    function open() {
      lastFocus = document.activeElement;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var f = focusables(); if (f.length) f[0].focus();
      document.addEventListener('keydown', onKey);
    }
    function close() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (lastFocus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = focusables(); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target.matches('[data-mobile-link]')) close();
    });
  }

  function wireRailAndReveals() {
    var sectionsForRail = SECTORS.map(function (s) { return document.getElementById('sector-' + s.id); }).filter(Boolean);
    var ticks = {};
    document.querySelectorAll('.rail-tick').forEach(function (t) { ticks[t.getAttribute('data-rail')] = t; });

    // Rail fill by scroll progress through the subsidiaries region.
    var railEl = document.getElementById('rail');
    var firstSec = sectionsForRail[0];
    var lastSec = sectionsForRail[sectionsForRail.length - 1];
    function updateFill() {
      if (!railEl || !firstSec || !lastSec) return;
      var start = firstSec.offsetTop;
      var end = lastSec.offsetTop + lastSec.offsetHeight;
      var mid = window.scrollY + window.innerHeight / 2;
      var pct = Math.max(0, Math.min(1, (mid - start) / (end - start)));
      railEl.style.setProperty('--rail-fill', (pct * 100) + '%');
    }
    window.addEventListener('scroll', updateFill, { passive: true });
    window.addEventListener('resize', updateFill);
    updateFill();

    // Active tick via IntersectionObserver.
    if ('IntersectionObserver' in window) {
      var active = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            Object.keys(ticks).forEach(function (k) { ticks[k].setAttribute('aria-current', 'false'); });
            var id = en.target.id.replace('sector-', '');
            if (ticks[id]) ticks[id].setAttribute('aria-current', 'true');
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      sectionsForRail.forEach(function (s) { active.observe(s); });
    }

    // Reveals + count-up trigger.
    var reveals = document.querySelectorAll('.reveal');
    if (prefersReduced || !('IntersectionObserver' in window)) {
      reveals.forEach(function (r) { r.classList.add('is-visible'); });
      runCountUps();
      return;
    }
    var statsFired = false;
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          if (!statsFired && en.target.querySelector && en.target.querySelector('[data-countup]')) {
            statsFired = true; runCountUps();
          }
          obs.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (r) { ro.observe(r); });

    // Safety net: if count-up host is above the fold on load.
    setTimeout(function () { if (!statsFired) { statsFired = true; runCountUps(); } }, 1600);
  }

  function runHero() {
    var hero = document.getElementById('hero-mark');
    if (!hero) return;
    if (prefersReduced) { document.body.classList.add('no-anim'); return; }
    // Trigger the draw-in on next frame.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add('hero-animate'); });
    });
  }

  /* ====================================================================== */
  /*  JSON-LD — Organization, built from GROUP + all subsidiaries           */
  /*  Generated here so adding a subsidiary needs no change anywhere else.  */
  /* ====================================================================== */
  function buildJsonLd() {
    var ro = GROUP.registeredOffice;
    var subs = SUBSIDIARIES.map(function (s) {
      var name = isPlaceholder(s.name)
        ? labelForSector(s.sector) + ' subsidiary (name to be confirmed)'
        : s.name;
      var obj = { '@type': 'Organization', name: name };
      if (!isPlaceholder(s.link)) obj.url = s.link;
      return obj;
    });

    var data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      legalName: GROUP.legalName,
      name: GROUP.shortName,
      slogan: GROUP.mottoEnglish,
      identifier: GROUP.companyNumber,
      url: GROUP.domain,
      logo: GROUP.domain + '/assets/logo/nac-logo-horizontal.svg',
      email: GROUP.email,
      telephone: GROUP.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ro.street,
        addressLocality: ro.locality,
        addressRegion: ro.region,
        postalCode: ro.postcode,
        addressCountry: ro.countryCode
      },
      subOrganization: subs
    };
    if (GROUP.founded) data.foundingDate = String(GROUP.founded);
    if (typeof REGIONS !== 'undefined' && REGIONS.length) {
      data.areaServed = REGIONS.map(function (r) { return { '@type': 'Place', name: r }; });
    }

    var tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(tag);
  }

  /* ====================================================================== */
  /*  BOOT                                                                  */
  /* ====================================================================== */
  function init() {
    buildJsonLd();
    buildNav();
    buildRail();
    buildStats();
    buildSubsidiaries();
    buildReach();
    buildForm();

    wireHeader();
    wireMobileNav();
    wireRailAndReveals();
    runHero();

    // Stamp dynamic bits of the footer / meta.
    var yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
