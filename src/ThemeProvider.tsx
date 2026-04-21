import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { themes, Theme, space, radius, typography, shadow, motion, hitSlop } from './tokens';

/**
 * ThemeProvider
 *
 * Wrap your app root. Follows the system color scheme by default;
 * pass `override="light" | "dark"` to force a mode (e.g. for user
 * preference stored in settings).
 */

type Mode = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  mode: Mode;
  setMode: (m: Mode | 'system') => void;
  // Convenience passthroughs so consumers don't need two imports
  space: typeof space;
  radius: typeof radius;
  typography: typeof typography;
  shadow: typeof shadow;
  motion: typeof motion;
  hitSlop: typeof hitSlop;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  override,
}: {
  children: React.ReactNode;
  override?: Mode;
}) {
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );
  const [userPref, setUserPref] = useState<Mode | 'system'>('system');

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const mode: Mode = override
    ?? (userPref === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : userPref);

  const value = useMemo<ThemeContextValue>(() => ({
    theme: themes[mode],
    mode,
    setMode: setUserPref,
    space, radius, typography, shadow, motion, hitSlop,
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
