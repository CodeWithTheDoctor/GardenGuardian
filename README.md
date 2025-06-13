# 🌱 GardenGuardian AI - Your AI-Powered Garden Health Detective

**Production-Ready Commercial Plant Health Platform** 🏆

A revolutionary mobile-first web application that democratizes professional-grade plant health diagnosis for Australian home gardeners through AI-powered image recognition, functional user actions, and personalized treatment recommendations.

![GardenGuardian AI Hero](https://images.pexels.com/photos/7728078/pexels-photo-7728078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## 🎯 Problem We Solve

Australian home gardeners lose **30-40% of their produce annually** due to late detection of pests and diseases. Current solutions require expensive consultants or extensive botanical knowledge that busy families don't possess.

**GardenGuardian AI changes this by providing instant, professional-grade plant health diagnosis with functional user actions in your pocket.**

## ✨ Key Features

### 🔬 **AI Plant Doctor**

- Instant disease/pest identification via photo upload
- Advanced Gemini 2.0 Flash AI for intelligent plant health analysis
- Australian-specific expertise and treatment recommendations
- Mobile camera integration with auto-focus
- Professional diagnosis experience with collapsible disclaimers

### 📱 **Functional User Actions**

- **Working Share System**: Native Web Share API with intelligent clipboard fallback
- **Professional Report Generation**: Downloadable HTML reports with comprehensive diagnosis data
- **Smart Toast Notifications**: Real-time user feedback for all actions
- **Cross-Platform Compatibility**: Seamless functionality on mobile and desktop
- **Professional File Management**: Structured naming with date stamps

### 🇦🇺 **Australian Compliance Engine**

- APVMA-registered treatment recommendations
- State-specific biosecurity regulations
- Professional treatment verification requirements
- Climate zone-specific advice

### 📱 **Mobile-First Design**

- Progressive Web App (PWA) capabilities
- Touch-optimized interface for garden use
- Works in direct sunlight conditions
- **Enhanced**: Professional presentation suitable for commercial deployment

### 🌐 **Community Platform**

- User authentication and data isolation
- Professional user profiles
- Privacy-first architecture
- Expert verification system (requires configuration)

### 📊 **Health Dashboard**

- Plant diagnosis history
- Treatment recommendations
- Weather-based alerts (requires OpenWeather API key)
- Professional error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/CodeWithTheDoctor/GardenGuardian.git
cd garden-guardian-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Required Environment Variables

```bash
# Gemini AI (Required for intelligent plant health analysis)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key

# Firebase (Required for persistence, auth, community)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Weather (Optional - for enhanced weather features)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_weather_key
```

## 📚 Documentation

Comprehensive documentation is organized in the [`docs/`](./docs/) folder:

- **[Testing Guide](./docs/testing/)** - Complete testing infrastructure with Vitest + Cypress
- **[Project Planning](./docs/planning/)** - Strategy, roadmaps, and business plans  
- **[Status & Implementation](./docs/status/)** - Current progress and achievements (Phase 7 Complete!)
- **[Demo Materials](./docs/demo/)** - Presentation scripts and demo preparation
- **[Technical Architecture](./docs/architecture/)** - System design and architecture

📖 **[Full Documentation Index](./docs/README.md)** - Start here for complete navigation

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Styling**: Custom Australian garden color palette
- **Mobile**: Progressive Web App (PWA)
- **User Experience**: Toast notifications, Web Share API, professional disclaimers
- **Deployment**: Ready for Netlify/Vercel

## 🎨 Design System

### Color Palette

```css
--garden-dark: #386641    /* Primary dark green */
--garden-medium: #6a994e  /* Primary medium green */
--garden-light: #a7c957   /* Primary light green */
--garden-cream: #f2e8cf   /* Cream background */
--garden-alert: #bc4749   /* Accent red for alerts */
```

### Mobile-First Approach

- Touch targets minimum 44px
- Thumb-friendly navigation
- Optimized for outdoor use
- High contrast for sunlight visibility
- **Enhanced**: Professional presentation for commercial use

## 🌟 Recent Achievements (Phase 7)

### 🎨 **Professional UX Enhancement**

- **Functional Share & Save**: Working Share and Save Report with cross-platform compatibility
- **Professional Disclaimers**: Collapsible AI disclaimers with professional yellow color scheme
- **Streamlined Interface**: Removed prototype elements and confusing buttons
- **Smart User Feedback**: Toast notification system with success/error states
- **Commercial Presentation**: Interface suitable for paid subscriptions

## 📱 Progressive Web App Features

- **Installable**: Add to home screen
- **Camera Integration**: Native mobile camera access
- **Professional UX**: Commercial-grade user experience
- **Cross-Platform**: Works on all modern browsers
- **Responsive Design**: Optimized for all screen sizes

## 🇦🇺 Australian Market Focus

### Compliance Features

- **APVMA Registration**: All chemical treatments include registration numbers
- **State Regulations**: Biosecurity compliance by state
- **Professional Verification**: Clear requirements for treatment verification
- **Climate Zones**: Recommendations based on Australian climate data

### Common Australian Diseases Covered

- Tomato Leaf Spot (Septoria)
- Rose Aphid Infestation  
- Citrus Canker
- Powdery Mildew
- Fruit Fly Management
- Black Spot on Roses

## 🏆 Competitive Advantages

1. **First Australian-Specific Platform**: Only solution trained on Australian pest/disease patterns
2. **Regulatory Compliance**: Built-in APVMA and biosecurity compliance
3. **Mobile-First**: Designed for actual garden use conditions
4. **Professional Grade**: Advanced AI analysis in consumer format
5. **Commercial-Ready UX**: Professional interface suitable for monetization

## 📊 Market Impact

- **Target Market**: 40% of Australian households (4.2M homes)
- **Market Size**: $4.5B annual home gardening market
- **Potential Savings**: $500-2000 per household annually
- **Social Impact**: Reduced food waste, increased food security

## 🔮 Future Roadmap

### Phase 7 (Current - COMPLETE ✅)

- ✅ Professional UX enhancement
- ✅ Functional Share & Save Report
- ✅ Enhanced diagnosis experience
- ✅ Commercial-ready presentation

### Phase 8 (Next 3 months)

- 🔄 Premium subscription tiers
- 🔄 Advanced AI model training
- 🔄 Payment processing integration
- 🔄 Enhanced analytics dashboard

### Phase 9 (6 months)

- 🔄 AR plant scanning
- 🔄 IoT sensor integration
- 🔄 Predictive health modeling
- 🔄 B2B nursery partnerships

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Australian Department of Agriculture** for biosecurity guidelines
- **APVMA** for treatment registration data
- **Local gardening communities** for disease pattern insights
- **Hackathon organizers** for the opportunity to build this solution

## 📞 Contact

**NOTE:** Prospective links, as this is a work in progress.

- **Website**: [gardenguardian.com.au](https://gardenguardian.com.au)
- **Email**: <hello@gardenguardian.com.au>
- **Twitter**: [@GardenGuardianAI](https://twitter.com/GardenGuardianAI)

---

**Built with ❤️ for Australian gardeners** 🇦🇺

*Saving plants, one diagnosis at a time - now with professional user experience.*
