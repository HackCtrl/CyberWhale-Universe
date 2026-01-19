module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../src/**/*.{ts,tsx,js,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0f1724',
        foreground: '#e6e9ef',
        primary: '#9fef00',
        secondary: '#60a5fa'
      },
      borderRadius: {
        lg: '8px'
      }
    }
  },
  plugins: []
};
