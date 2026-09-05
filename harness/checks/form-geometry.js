// Browser expression: pass this file to agent-browser eval --stdin (or -b).
// Checks rendered control geometry, including overflow hidden by a dialog.
(() => {
  const dialog = document.querySelector('dialog[open]');
  if (!dialog) throw new Error('Open the form dialog before checking geometry');
  const bounds = dialog.getBoundingClientRect();
  const controls = [...dialog.querySelectorAll('input:not([type=hidden]), textarea, [role=combobox]')]
    .filter((element) => element.getClientRects().length > 0)
    .map((element) => ({
      name: element.getAttribute('aria-label') || element.id || element.tagName,
      rect: element.getBoundingClientRect(),
    }));
  const clipped = controls.filter(({ rect }) => rect.left < bounds.left - 1 || rect.right > bounds.right + 1);
  const overlaps = [];
  for (let i = 0; i < controls.length; i++) {
    for (let j = i + 1; j < controls.length; j++) {
      const a = controls[i].rect;
      const b = controls[j].rect;
      if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) {
        overlaps.push([controls[i].name, controls[j].name]);
      }
    }
  }
  const submit = dialog.querySelector('button[type=submit]')?.getBoundingClientRect();
  const footerVisible = Boolean(submit && submit.top >= 0 && submit.bottom <= innerHeight);
  const result = { viewport: [innerWidth, innerHeight], controls: controls.length,
    clipped: clipped.map(({ name }) => name), overlaps, footerVisible };
  if (clipped.length || overlaps.length || !footerVisible) throw new Error(JSON.stringify(result));
  return result;
})();
