export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 10px 40px rgba(15, 23, 42, 0.15)',
      },
      backgroundImage: {
        glass: 'radial-gradient(circle at top left, rgba(59,130,246,.15), transparent 28%), radial-gradient(circle at bottom right, rgba(168,85,247,.18), transparent 22%)',
      },
    },
  },
  plugins: [],
}
