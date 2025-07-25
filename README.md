# IEEE Green University of Bangladesh - Official Website

The official website for IEEE Student Branch at Green University of Bangladesh, showcasing our community of over 3000 members dedicated to innovation, learning, and professional growth in electrical and computer engineering.

## Features

### Homepage

- Hero section with animated backgrounds  
- About section covering mission, values, and activities  
- Statistics display showing member count and achievements  
- Featured events section  
- FAQ with expandable answers  
- IEEE collaborations showcase  

### Events

- Event listings with search and filtering  
- Detailed event pages with speaker info, galleries, and highlights  
- Registration links for events  
- Types of events: webinars, workshops, seminars, competitions  

### Executive Team

- Dynamic directory sorted by year and chapter  
- Member profiles with social links and roles  
- Filters for Student Branch (SB), Computer Society (CS), and Power & Energy Society (PES)  
- Year-based navigation (2021–2025)  
- Member detail modals with full information  

### Gallery

- Photo grid using masonry layout  
- Lightbox view for individual images  
- Pagination for better navigation  
- Responsive across devices  

### Theme & Design

- Toggle between dark and light mode with system preference detection  
- Fully responsive design for mobile, tablet, and desktop  
- Built with Tailwind CSS and custom animations  
- Follows accessibility standards  

## Getting Started

### Prerequisites

- Node.js version 18 or higher  
- npm  

### Installation

```bash
git clone https://github.com/MDATIK-3/IEEEWebsite
cd IEEEWebsite
npm install
npm run dev
````

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

* Next.js 15.3.4 (App Router)
* React 19.0.0
* Tailwind CSS 4.0
* Animations: Framer Motion
* Theme: next-themes
* Analytics: Vercel Analytics
* Deployment: Vercel

## Customization

### Adding Events

1. Add event data to `src/data/eventData.json`
2. Add corresponding images to `public/images/`
3. Events will automatically appear

### Adding Team Members

1. Update `src/data/executiveData.json`
2. Upload member photos to `public/images/`
3. Assign to the correct year and chapter

### Styling

* Global styles: `src/app/globals.css`
* Tailwind configuration: `tailwind.config.js`
* Component-level styling within JSX files

## Contributing

### Steps

1. Fork the repository
2. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make and test your changes
4. Submit a pull request

### Guidelines

* Use the provided ESLint configuration
* Follow React and Next.js best practices
* Maintain responsive design
* Ensure accessibility

## Contact

* Website: [ieeegub.vercel.app](https://ieeegub.vercel.app/)
* Facebook: [IEEE Student Branch GUB](https://www.facebook.com/ieeesbgub/)
* For other inquiries, use the feedback form on the website

## License

Maintained by IEEE Student Branch, Green University of Bangladesh.

## Acknowledgments

* Green University of Bangladesh
* IEEE Organization
* All contributors
* Executive Committee

