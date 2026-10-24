(() => {
  let preference = 'light';
  try {
    preference = localStorage.getItem('axi-theme') || localStorage.getItem('reading-theme') || 'light';
  } catch {}
  if (!['light', 'dark', 'system'].includes(preference)) preference = 'light';
  const dark = preference === 'dark' || (preference === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.dataset.themePreference = preference;
  document.querySelector('meta[name="theme-color"]').content = dark ? '#0B0B10' : '#FCFCFD';
})();
