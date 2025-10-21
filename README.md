# GardenGuardian AI

A plant health diagnosis app for Australian home gardeners. Take a photo of your sick plant, get instant AI-powered identification and treatment advice.

![GardenGuardian AI Hero](https://images.pexels.com/photos/7728078/pexels-photo-7728078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Why I Built This

I got tired of watching my tomato plants die from mystery diseases. Turns out I'm not alone - Aussie home gardeners lose about a third of their produce every year because they catch problems too late. Professional plant consultants are expensive, and honestly, who has time to flip through gardening books while their plants are wilting?

So I built GardenGuardian. Point your phone camera at a sick plant, and the AI tells you what's wrong and how to fix it. No guesswork, no expensive consultations.

## What It Does

**AI Diagnosis**
- Upload a photo and get instant disease/pest identification
- Uses Gemini 2.0 Flash for the actual analysis
- Treatment recommendations specific to Australian conditions
- Works with your phone camera

**Actually Useful Features**
- Share diagnoses with your gardening mates (native share button or copies to clipboard)
- Download full diagnosis reports as HTML files
- Toast notifications so you know what's happening
- Collapsible disclaimers (because yes, it's AI, we get it)

**Mobile-Friendly**
- Built as a Progressive Web App
- Works in bright sunlight (important when you're actually in the garden)
- Touch-friendly buttons
- Can install it on your home screen

**Community Stuff**
- User authentication
- Personal diagnosis history
- Weather alerts (if you set up the API key)

## Getting Started

You'll need Node.js 18 or newer.

```bash
git clone https://github.com/CodeWithTheDoctor/GardenGuardian.git
cd garden-guardian-ai
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### API Keys You'll Need

Create a `.env.local` file:

```bash
# Required - the AI won't work without this
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key

# Required for saving diagnoses and user accounts
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional - for weather features
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_weather_key
```

## Documentation

I've organized the docs in the [`docs/`](./docs/) folder:

- **[Testing Guide](./docs/testing/)** - Vitest and Cypress setup
- **[Project Planning](./docs/planning/)** - Original plans and roadmap  
- **[Status Updates](./docs/status/)** - What's done, what's next
- **[Demo Materials](./docs/demo/)** - Presentation prep
- **[Architecture](./docs/architecture/)** - How it's built

Start at the **[Documentation Index](./docs/README.md)** if you want the full tour.

## Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS with a custom green color scheme
- shadcn/ui components
- Lucide icons
- PWA-ready

The color palette is based on actual garden greens:

```css
--garden-dark: #386641
--garden-medium: #6a994e
--garden-light: #a7c957
--garden-cream: #f2e8cf
--garden-alert: #bc4749
```

## What's New (Phase 7)

Just finished cleaning up the UX:

- Share and Save Report buttons actually work now
- Made the AI disclaimers collapsible (they were taking up too much space)
- Removed some confusing prototype buttons
- Added proper toast notifications
- Generally made it look less like a prototype and more like a real app

## Australian-Specific Features

This isn't just a generic plant app with an Aussie flag slapped on it. The AI knows Australian diseases:

- Common stuff like tomato leaf spot and rose aphids
- Citrus canker (big problem here)
- Fruit fly management
- Powdery mildew treatments

All chemical recommendations include APVMA registration numbers because that actually matters for compliance.

## What's Next

**Soon:**
- Premium subscription options (need to figure out pricing)
- Better AI training with more Australian plant data
- Payment processing
- Analytics dashboard

**Later:**
- AR plant scanning (point and diagnose)
- IoT sensor integration
- Predictive health modeling
- Maybe partner with nurseries

## Contributing

Pull requests welcome. Run `npm test` before submitting.

```bash
npm install
npm run dev
npm test
npm run build
```
---

Built in Australia for Australian gardeners 🇦🇺
