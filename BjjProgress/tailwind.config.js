// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Keep legacy colors for compatibility
        background: '#3a293d',
        primary: '#b123c7',
        text: '#fefcfe',
        
        // Enhanced dark theme
        'dark-bg': '#0a0e1a',
        'dark-card': '#151b2e',
        'dark-border': '#1e293b',
        
        // Vibrant BJJ accents
        'bjj-purple': '#8b5cf6',
        'bjj-pink': '#ec4899',
        'bjj-blue': '#3b82f6',
        'bjj-orange': '#f97316',
        'bjj-green': '#10b981',
        'bjj-red': '#ef4444',
        
        // Achievement colors
        'gold': '#fbbf24',
        'bronze': '#d97706',
      },
      fontFamily: {
        // Existing fonts
        'lato': ['Lato_400Regular'],
        'lato-bold': ['Lato_700Bold'],
        'montserrat': ['Montserrat_700Bold'],
        
        // New premium fonts
        'bebas': ['BebasNeue_400Regular'],
        'inter': ['Inter_400Regular'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
