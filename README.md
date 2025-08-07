# MockDrilling - Technical Interview Practice Platform

A modern web application for practicing technical interviews with AI-powered feedback and expert guidance. Built with Next.js, React, TypeScript, and Firebase.

## 🚀 Features

### Core Features
- **Free Mock Interviews**: Practice unlimited technical interviews in frontend, backend, and DSA
- **Professional Mock Interviews**: Upgrade for company-specific interviews with expert feedback
- **Real-time AI Feedback**: Get instant feedback on your interview performance
- **Interview Analytics**: Track your progress and performance over time
- **User Authentication**: Secure login/signup with Firebase Auth
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light themes

### Technical Features
- **Modern UI/UX**: Built with Radix UI components and Tailwind CSS
- **Type Safety**: Full TypeScript support for better development experience
- **Performance Optimized**: Next.js 14 with App Router for optimal performance
- **Real-time Data**: Firebase Firestore for real-time data synchronization
- **Email Integration**: Nodemailer for email notifications
- **3D Graphics**: Three.js integration for enhanced visual experience

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: Latest React features and hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons
- **Next Themes**: Dark/light theme support

### Backend & Services
- **Firebase**: Authentication and Firestore database
- **Firestore**: NoSQL database for real-time data
- **Nodemailer**: Email service integration

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Firebase project setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mockdrilling-website
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Email Configuration (if using Nodemailer)
EMAIL_SERVER_HOST=your_email_host
EMAIL_SERVER_PORT=your_email_port
EMAIL_SERVER_USER=your_email_user
EMAIL_SERVER_PASSWORD=your_email_password
```

### 4. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Update the Firestore rules with the provided `firestore.rules`
5. Add your Firebase configuration to the environment variables

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Other Commands
```bash
# Lint the code
npm run lint

# Type checking
npx tsc --noEmit
```

## 📁 Project Structure

```
mockdrilling-website/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and interview pages
│   ├── components/        # App-specific components
│   ├── globals.css        # Global styles
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Home page
├── components/            # Shared components
│   ├── ui/               # UI components (Radix UI)
│   ├── auth-provider.jsx # Authentication provider
│   ├── debug-auth.jsx    # Debug authentication
│   ├── protected-route.jsx # Route protection
│   └── theme-provider.tsx # Theme provider
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── scripts/              # Build scripts
├── styles/               # Additional styles
├── firestore.rules       # Firestore security rules
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🔐 Authentication

The application uses Firebase Authentication with the following features:
- Email/password authentication
- Protected routes
- User session management
- Automatic redirect to dashboard for authenticated users

## 🎨 Styling

The application uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Custom CSS**: Global styles and animations
- **Theme Support**: Dark and light mode toggle

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Configuration Files

### Next.js Configuration (`next.config.mjs`)
- Image optimization
- Font optimization
- Performance optimizations

### Tailwind Configuration (`tailwind.config.ts`)
- Custom color palette
- Animation configurations
- Component styling

### TypeScript Configuration (`tsconfig.json`)
- Strict type checking
- Path aliases
- Module resolution

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

Stay updated with the latest changes:
- Follow the repository for updates
- Check the [Releases](https://github.com/your-repo/releases) page
- Read the [Changelog](CHANGELOG.md) for detailed updates

---

**MockDrilling** - Practice technical interviews with confidence! 🎯
