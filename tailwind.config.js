export const darkMode = 'class'; 

export const content = ["./src/**/*.{js,ts,jsx,tsx,mdx}"];

export const theme = {
    extend: {
        colors: {
            background: "var(--background)",
            foreground: "var(--foreground)",
            card: {
                DEFAULT: "var(--card-background)",
                foreground: "var(--card-foreground)",
            },
            accent: "var(--primary-accent)",
            muted: {
                foreground: "var(--muted-foreground)",
            },
            border: "var(--border-color)",
        },
    },
};

export const plugins = [];