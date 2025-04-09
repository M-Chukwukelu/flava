
import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],

	daisyui: {
		themes: [
			"light",
			{
				flava: {
					...daisyUIThemes["light"],
					"primary-content": "#ffffff",
          secondary: "#e8dcff",
          accent: "#beaae6",
          neutral: "#f9f6ff",
          "base-100": "#ffffff",
          info: "#93c5fd",
          success: "#34d399",
          warning: "#facc15",
          error: "#f87171",
				},
			},
		],
	},
};
