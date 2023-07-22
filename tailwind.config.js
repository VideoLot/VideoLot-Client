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
        'loader-texture': "url('/loader-texture.svg')"
      },
      height: {
        '25vw': "25vw",
      },
      width: {
        '85hw': "85hw"
      },
      flex: {
        '0': '0 0 auto'
      }
    },
  },
  plugins: [],
}
