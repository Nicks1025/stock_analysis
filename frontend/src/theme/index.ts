/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Central design theme constants representing specified colors and immersive presets
export const theme = {
  colors: {
    primary: '#1565C0',        // Deep Blue
    secondary: '#00C853',      // Market Green
    error: '#D32F2F',          // Red
    background: {
      dark: '#0A0E17',
      light: '#F5F7FA'
    },
    // Immersive UI cyber theme accents
    cyber: {
      cyan: '#00f2ff',
      amber: '#ffaa00',
      terminalBg: '#050508',
      glassBg: 'rgba(20, 20, 35, 0.65)',
      glassBorder: 'rgba(100, 100, 255, 0.15)',
    }
  },
  typography: {
    fontSans: '"Inter", system-ui, -apple-system, sans-serif',
    fontMono: '"JetBrains Mono", "Fira Code", monospace'
  },
  animations: {
    spinSlow: 'spin 15s linear infinite',
    pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }
};

export default theme;
