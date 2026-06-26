export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        fun: ['"Fredoka One"', 'cursive'],
      },
      animation: {
        bounce: 'bounce 0.5s ease-in-out',
        'pop-in': 'popIn 0.3s ease-out',
        shake: 'shake 0.4s ease-in-out',
        confetti: 'confettiFall 1s ease-out forwards',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
      },
    },
  },
  plugins: [],
}
