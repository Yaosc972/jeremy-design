// Inject into the current test page. Does not navigate, click or write business data.
// Mechanical observations and visual reviews are recorded separately.
(() => {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const visible = el => {
    if (!el || !el.isConnected) return false;
    for (let node = el; node instanceof Element; node = node.parentElement) {
      const css = getComputedStyle(node);
      if (css.display === 'none' || css.visibility === 'hidden' ||
          css.visibility === 'collapse' || Number(css.opacity) === 0) return false;
    }
    return [...el.getClientRects()].some(r => r.width > 0 && r.height > 0 &&
      r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight);
  };
  const select = selector => {
    if (typeof selector !== 'string' || !selector.trim()) throw Error('A CSS selector is required');
    const nodes = [...document.querySelectorAll(selector)];
    if (nodes.length > 1) throw Error(`Ambiguous selector: ${selector} (${nodes.length})`);
    return nodes[0];
  };
  const probe = spec => {
    const { type, selector, container } = spec;
    const el = select(selector);
    if (type === 'visible') return { pass: visible(el), reason: 'Expected element visible in viewport' };
    if (type === 'hidden') {
      // Off-screen position is not a valid dismissal: content can remain focusable.
      // A zero-size or display:contents root may still have visible children.
      const rendered = el && [el, ...el.querySelectorAll('*')].some(node => {
        const css = getComputedStyle(node);
        return css.visibility !== 'hidden' && css.visibility !== 'collapse' &&
          [...node.getClientRects()].some(r => r.width > 0 && r.height > 0);
      });
      return { pass: !rendered, reason: 'Expected removed or layout/visibility-hidden subtree; opacity alone is insufficient' };
    }
    if (type === 'focusWithin') return {
      pass: visible(el) && el.contains(document.activeElement), reason: 'Expected active focus inside target'
    };
    if (type === 'contained') {
      const parent = select(container);
      if (!visible(el) || !visible(parent) || !parent.contains(el)) return { pass: false, reason: 'Expected visible child and its visible container' };
      const a = el.getBoundingClientRect(), b = parent.getBoundingClientRect();
      return { pass: a.left >= b.left - 1 && a.right <= b.right + 1 &&
        a.top >= b.top - 1 && a.bottom <= b.bottom + 1, reason: 'Expected child bounds inside container (1 CSS px tolerance)' };
    }
    throw Error(`Unknown check: ${type}`);
  };
  window.createUISelfCheck = plan => {
    if (!Array.isArray(plan) || !plan.length || plan.some(s => typeof s !== 'string' || !s.trim()) || new Set(plan).size !== plan.length)
      throw Error('Plan must contain unique, nonempty state names');
    const rows = new Map(plan.map(state => [state, { state, checks: [], automatic: 'not-run', visual: { status: 'not-run' } }]));
    const rowFor = state => {
      if (!rows.has(state)) throw Error(`Unplanned state: ${state}`);
      return rows.get(state);
    };
    return {
      inspect(state, specs) {
        const row = rowFor(state);
        // Invalidate earlier evidence before any retry, including invalid retries.
        row.checks = []; row.automatic = 'not-run'; row.visual = { status: 'not-run' };
        if (!Array.isArray(specs) || !specs.length) throw Error('At least one check is required');
        row.checks = specs.map(spec => {
          try { const result = probe(spec); return { ...spec, status: result.pass ? 'passed' : 'failed', reason: result.reason }; }
          catch (e) { return { ...spec, status: 'failed', reason: String(e.message || e) }; }
        });
        row.automatic = row.checks.every(c => c.status === 'passed') ? 'passed' : 'failed';
        row.url = location.href; row.viewport = [innerWidth, innerHeight]; row.observedAt = new Date().toISOString();
        return clone(row);
      },
      review(state, { status, evidence, note } = {}) {
        const row = rowFor(state);
        if (row.automatic === 'not-run') throw Error('Inspect the state before visual review');
        if (!['passed', 'failed'].includes(status) || typeof evidence !== 'string' || !evidence.trim() ||
            typeof note !== 'string' || !note.trim()) throw Error('Visual review needs status, screenshot reference and observation');
        row.visual = { status, evidence, note };
        return clone(row);
      },
      report() {
        const states = [...rows.values()].map(row => ({ ...clone(row), status:
          row.automatic === 'failed' || row.visual.status === 'failed' ? 'failed' :
          row.automatic === 'not-run' || row.visual.status === 'not-run' ? 'not-run' : 'passed' }));
        const counts = { passed: 0, failed: 0, 'not-run': 0 };
        states.forEach(row => counts[row.status]++);
        return { status: counts.failed ? 'failed' : counts['not-run'] ? 'not-run' : 'passed', counts, states };
      }
    };
  };
})();
