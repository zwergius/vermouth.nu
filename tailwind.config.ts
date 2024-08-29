import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontSize: {
			xs: ['0.75rem', '1.5rem'], // 12px / 24px
			sm: ['1rem', '1.5rem'], // 16px / 24px
			base: ['1.75rem', '2.125rem'], // 28px / 34px
			lg: ['2rem', '3rem'], // 32px / 48px
			xl: ['2.5rem', '2.75rem'], // 40px / 44px
			'2xl': ['2.625rem', '3.125rem'], // 42px / 50px
			'3xl': ['6.25rem', '6.875rem'] // 100px / 110px
		},
		extend: {
			colors: {
				'brand-blue': '#0B10AC',
				'brand-pink': '#FFC0CB',
				'brand-red': '#F20505',
				'brand-yellow': '#FFC000'
			}
		}
	},

	plugins: []
} as Config;
