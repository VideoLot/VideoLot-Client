/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'rewind-button-texture': "url('/rewind-button-texture.svg')",
        'play-button-texture': "url('/play-button-texture.svg')",
        'simple-play-button-texture': "url('/simple-play-button-texture.svg')",
        'pause-button-texture': "url('/pause-button-texture.svg')",
        'simple-pause-button-texture': "url('/simple-pause-button-texture.svg')",
        'fast-forward-button-texture': "url('/fast-forward-button-texture.svg')",
        'plus-button-texture': "url('/plus-texture.svg')",
        'loader-texture': "url('/loader-texture.svg')",
        'settings-texture': "url('/settings-texture.svg')",
        'closure-texture': "url(/closure-texture.svg)",
        'right-arrow-texture': "url(/right-arrow-texture.svg)",
        'expand-texture': "url(/expand-texture.svg)",
        'collapse-texture': "url(/collapse-texture.svg)"
      },
      backgroundColor: {
        'popup': 'rgb(var(--popup-bg))'
      },
      height: {
        '25vw': "25vw",
        '90vh': "90vh",
        '25vh': "25vh"
      },
      width: {
        '85vw': "85vw",
        '85vh': "85vh"
      },
      flex: {
        '0': '0 0 auto'
      },
      minHeight: {
        '30vh': '30vh'
      },
      maxHeight: {
        '90vh': "90vh",
        '25vh': "25vh"
      } 
    },
  },
  plugins: [],
}
