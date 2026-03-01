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
        // Primary palette (from Figma tokens)
        primary: {
          DEFAULT: '#9fef00',
          50: '#f6ffe6',
          100: '#ecffcc',
          200: '#d7ff99',
          300: '#bfff66',
          400: '#9fff33',
          500: '#9fef00',
          600: '#86d500',
          700: '#6aac00',
          800: '#518200',
          900: '#375900'
        },
        'primary-foreground': '#0b0b00',
        secondary: {
          DEFAULT: '#60a5fa',
          500: '#60a5fa',
          600: '#3b82f6'
        },
        'secondary-foreground': '#05204a',
        card: '#0b1220',
        'card-foreground': '#e6e9ef',
        muted: '#94a3b8',
        'muted-foreground': '#6b7280',
        destructive: '#ef4444',
        ring: '#9fef00',
        accent: '#0ea5a4',
        input: '#0f1724',
        border: '#1f2937'
      },
      borderRadius: {
        lg: '8px'
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '30px']
      }
    }
  },
  plugins: []
};
