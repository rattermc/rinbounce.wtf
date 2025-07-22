import flowbitePlugin from 'flowbite/plugin';
import tailwindcssAnimated from 'tailwindcss-animated';
import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}', 
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
	],
	darkMode: 'class', 
	theme: {
		extend: {
			fontFamily: {
				lexend: ['Lexend', 'sans-serif'], 
			},
			colors: {
				primary: {
					light: '#ffe6eb',  
					DEFAULT: '#ffafcc',  
					dark: '#ff7499',  
					darker: '#ff3366',  
				},
				secondary: {
					light: '#ffccd5',  
					DEFAULT: '#ff99aa',  
					dark: '#ff6688',  
				},
				accent: {
					light: '#fff1f5',  
					DEFAULT: '#ffccd5',  
					dark: '#ff99aa',  
				},
				gray: {
					light: '#f7f7f7',  
					DEFAULT: '#e5e5e5',  
					dark: '#a3a3a3',  
				},
			},
			animation: {
				'spin-slow': 'spin 3s linear infinite',
				'bounce-slow': 'bounce 2s infinite',
				'fade-in': 'fadeIn 1s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				bounce: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-15px)' },
				},
			},
			screens: {
				'no-select': { 'user-select': 'none' },
			},
		},
	},
	plugins: [flowbitePlugin, tailwindcssAnimated],
};

export default config;
