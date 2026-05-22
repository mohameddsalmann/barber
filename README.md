# BarberFlow POS 💈

A modern, full-featured Point of Sale and management system for barbershops, built with React, TanStack Start, and AI-powered styling features.

## ✨ Features

### For Barbershops
- **Queue Management**: Real-time queue tracking and customer flow management
- **POS System**: Complete point-of-sale with service tracking and payments
- **Analytics Dashboard**: Business insights, revenue tracking, and performance metrics
- **Calendar Management**: Appointment scheduling and availability management
- **Client Management**: Customer profiles, history, and preferences
- **Barber Management**: Staff profiles, schedules, and performance tracking

### For Barbers
- **Personal Dashboard**: View earnings, queue, and upcoming appointments
- **Profile Management**: Showcase portfolio and manage availability
- **Queue View**: Real-time updates on waiting customers

### For Clients
- **Style Studio**: AI-powered hairstyle try-on and discovery
- **Barber Selection**: Browse and select preferred barbers
- **Queue Status**: Real-time queue position tracking
- **Profile Management**: Save preferences and view history

### AI-Powered Features
- **Virtual Try-On**: See how different hairstyles look on you using AI
- **Style Discovery**: Get personalized hairstyle recommendations
- **Image Generation**: AI-generated hairstyle previews

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/mohameddsalmann/barber.git
cd barber

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# Start development server
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080`

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
HF_API_KEY=your_huggingface_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
FAL_API_KEY=your_fal_api_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for instructions on obtaining these API keys.

## 📦 Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React-based)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **AI Integration**: Hugging Face, OpenRouter, FAL AI, Replicate

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mohameddsalmann/barber)

For detailed deployment instructions, see:
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Quick setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment documentation

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
barberflow-pos/
├── src/
│   ├── assets/          # Images and static assets
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components (buttons, cards, etc.)
│   │   └── barber/     # Barber-specific components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and helpers
│   ├── mock/           # Mock data for development
│   ├── routes/         # Application routes and pages
│   │   ├── dashboard.* # Admin dashboard routes
│   │   ├── barber.*    # Barber dashboard routes
│   │   └── client.*    # Client-facing routes
│   ├── router.tsx      # Router configuration
│   └── styles.css      # Global styles
├── public/             # Public assets
├── vercel.json         # Vercel configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## 📝 Documentation

- [BUSINESS_OVERVIEW.md](./BUSINESS_OVERVIEW.md) - Business logic and features
- [IMAGE_GENERATION_PROMPTS.md](./IMAGE_GENERATION_PROMPTS.md) - AI image generation guidelines
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Quick Vercel setup

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🔗 Links

- **Repository**: https://github.com/mohameddsalmann/barber
- **Issues**: https://github.com/mohameddsalmann/barber/issues

## 💡 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ for modern barbershops
