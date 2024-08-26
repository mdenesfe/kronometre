import { writable } from 'svelte/store';

export const darkMode = writable(false);

export function toggleDarkMode() {
  if (typeof window !== 'undefined') {
    darkMode.update((current) => {
      const newMode = !current;
      document.body.classList.toggle('dark', newMode);
      return newMode;
    });
  }
}

export const colorTheme = writable({
  primary: '--color-yellow-primary',
  secondary: '--color-yellow-secondary'
});

export function setColorTheme(theme) {
  colorTheme.set(theme);
  localStorage.setItem('color-theme', JSON.stringify(theme));

  document.documentElement.style.setProperty('--color-yellow-primary', `var(${theme.primary})`);
  document.documentElement.style.setProperty('--color-yellow-secondary', `var(${theme.secondary})`);
}

export function initializeColorTheme() {
  const storedTheme = localStorage.getItem('color-theme');
  if (storedTheme) {
    const parsedTheme = JSON.parse(storedTheme);
    setColorTheme(parsedTheme);
  }
}
