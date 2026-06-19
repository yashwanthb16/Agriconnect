import { useTheme } from '../context/ThemeContext';

// Inline slider toggle — for Navbar / Admin header
export function ThemeToggleInline({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 flex-shrink-0 ${
        isDark ? 'bg-slate-600' : 'bg-gray-300'
      } ${className}`}
    >
      <span className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
        <span className="text-[10px]">🌙</span>
        <span className="text-[10px]">☀️</span>
      </span>
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-xs ${
          isDark ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}

// Fixed right-edge tab — placed in App.jsx, visible on ALL pages, never covers top content
export function ThemeToggleFloat() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
      style={{
        position: 'fixed',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        zIndex: 99999,
        borderRadius: '8px 0 0 8px',
        writingMode: 'vertical-rl',
        padding: '10px 6px',
        fontSize: '18px',
        lineHeight: 1,
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        boxShadow: '-2px 2px 10px rgba(0,0,0,0.15)',
      }}
      className={`flex flex-col items-center gap-1 transition-all duration-300 hover:px-3 ${
        isDark
          ? 'bg-slate-700 text-yellow-300 hover:bg-slate-600'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span style={{ writingMode: 'horizontal-tb' }}>{isDark ? '☀️' : '🌙'}</span>
      <span style={{ writingMode: 'horizontal-tb', fontSize: '9px', letterSpacing: '0.5px', opacity: 0.7, textTransform: 'uppercase', fontWeight: 600 }}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

export default ThemeToggleInline;
