# IEEE Green University of Bangladesh - Official Website

Official website for the IEEE Student Branch at Green University of Bangladesh (IEEE GUB). This site highlights events, achievements, leadership, and community opportunities for students, alumni, and partners.

## Features

### Homepage
- Hero section with animated backgrounds
- About, moderator messages, and highlights
- Member spotlights
- Featured events and gallery previews
- IEEE collaborations showcase
- FAQ section

### Events
- Event listings with search and filters (all/upcoming/past)
- List and calendar views
- Countdown and Add-to-Calendar for upcoming events
- Detailed event pages with speakers, highlights, gallery, and resources
- Registration links for events

### Community
- **Join IEEE** page with global sign-up + IEEE GUB onboarding
- **Projects** showcase with tag filters
- **Opportunities** for volunteering and committees
- **Resources** hub for slides, recordings, and highlights

### Executive Team
- Directory sorted by year and chapter
- Filters for Student Branch (SB), Computer Society (CS), and Power & Energy Society (PES)
- Member detail modals with full information

### Gallery
- Masonry/grid views with pagination
- Lightbox for photos
- Search and category filtering

### Contact & Partnership
- General contact form (email delivery)
- Partnership inquiry form with CSRF protection

### Chatbot
- AI assistant powered by Gemini
- Answers based on local JSON data

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Framer Motion
- next-themes
- Vercel Analytics

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/MDATIK-3/IEEEWebsite
cd IEEEWebsite
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Environment Variables

Create a `.env` file in the project root. These are used by the API routes:

```bash
# Chatbot (Gemini)
GEMINI_API_KEY= use_your_api_key
GEMINI_MODEL=gemini-2.5-flash

# Contact + Partnership email
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_TO=

# GitHub contributors (optional)
NEXT_PUBLIC_GITHUB_TOKEN=
```

Notes:
- If `GEMINI_API_KEY` is missing, the chatbot will return a configuration error.
- If email settings are missing, contact/partnership forms will fail.
- If `NEXT_PUBLIC_GITHUB_TOKEN` is missing/invalid, the developer page will show local cached team info without contribution counts.

## Data Files (Content Source)

Update JSON files in `src/data/` to manage site content:

- `eventData.json` � events, speakers, galleries, resources
- `executiveData.json` � leadership directory
- `photos.json` � gallery photos
- `acievement.json` � achievements
- `collaboration.json` � collaborations
- `FAQ.json` � FAQ items
- `moderatorsMessages.json` � moderator messages
- `projects.json` � project showcase
- `opportunities.json` � volunteer opportunities
- `membership.json` � join page content and fees
- `spotlights.json` � member spotlights
- `ContributionRoles.json` � developer roles

## Customization

### Add / Update Events
1. Edit `src/data/eventData.json`
2. Add images under `public/images/`

### Add / Update Team Members
1. Edit `src/data/executiveData.json`
2. Upload images to `public/images/`

### Styling
- Global styles: `src/app/globals.css`
- Tailwind classes are used inside components

## Contributing

1. Fork the repository
2. Create a branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make and test your changes
4. Submit a pull request

## Contact

- Website: https://ieeegub.vercel.app/
- Facebook: https://www.facebook.com/ieeesbgub/
- For inquiries, use the contact form on the site.

## License

Maintained by IEEE Student Branch, Green University of Bangladesh.

## Acknowledgments

- Green University of Bangladesh
- IEEE Organization
- All contributors
- Executive Committee
