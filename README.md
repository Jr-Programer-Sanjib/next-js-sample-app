# New Life Care Midnapore - Healthcare Management System

A modern, full-stack healthcare management system built with Next.js, Firebase, and Tailwind CSS. This application provides a complete solution for managing a healthcare clinic with patient booking, doctor management, and administrative features.

## 🌟 Features

### Patient Side (Website)
- **Modern, Responsive Design** - Clean medical-themed UI with Tailwind CSS
- **Home Page** - Hero section, services overview, featured doctors, contact information
- **Online Booking System** - Easy appointment booking with form validation
- **Doctor Directory** - Browse and book appointments with specific doctors
- **Department Pages** - Specialized medical departments
- **Services Page** - Diagnostic services and lab tests
- **Contact Page** - Contact form and location information
- **Timetable View** - Weekly schedule for all doctors
- **AI Chatbot** - OpenAI-powered healthcare assistant

### Admin Dashboard
- **Secure Authentication** - Firebase Auth with protected routes
- **Appointment Management** - View, approve, cancel, and reschedule appointments
- **Doctor Management** - Add, edit, and manage doctor profiles and schedules
- **Service Management** - Manage medical services and pricing
- **Message Center** - View and respond to patient inquiries
- **Analytics Dashboard** - Overview statistics and recent activity

### Technical Features
- **Firebase Integration** - Firestore database, Authentication, and Hosting
- **Real-time Updates** - Live data synchronization
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags and structured data
- **Performance Optimized** - Next.js App Router and optimizations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- OpenAI API key (for chatbot)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd new-life-care-midnapore
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your Firebase and OpenAI credentials:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Get your project configuration

### 2. Firestore Collections
The app uses the following collections:
- `appointments` - Patient appointments
- `doctors` - Doctor profiles and schedules
- `services` - Medical services and pricing
- `messages` - Patient contact messages
- `users` - Admin users

### 3. Security Rules
Set up Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Appointments - anyone can create, only admins can read/write
    match /appointments/{docId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Doctors - only admins can read/write
    match /doctors/{docId} {
      allow read, write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Services - anyone can read, only admins can write
    match /services/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Messages - anyone can create, only admins can read
    match /messages/{docId} {
      allow create: if true;
      allow read: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

## 🎨 Customization

### Colors and Styling
The app uses a custom color palette defined in `tailwind.config.js`:
- Primary: `#2563EB` (Blue - trust & professionalism)
- Secondary: `#16A34A` (Green - healthcare)
- Background: `#F9FAFB` (Light gray)
- Text: `#111827` (Dark gray/black)

### Logo
The logo component is located in `components/Logo.tsx` and can be customized to match your brand.

### Content
Update the content in the following files:
- `app/page.tsx` - Home page content
- `components/Footer.tsx` - Contact information
- `app/api/chatbot/route.ts` - Chatbot system prompt

## 📱 Pages Structure

```
app/
├── page.tsx                 # Home page
├── booking/page.tsx         # Appointment booking
├── doctors/page.tsx         # Doctor directory
├── departments/page.tsx     # Medical departments
├── services/page.tsx        # Diagnostic services
├── timetable/page.tsx       # Weekly schedule
├── contact/page.tsx         # Contact information
└── admin/
    ├── login/page.tsx       # Admin login
    └── dashboard/page.tsx   # Admin dashboard
```

## 🔐 Admin Access

1. Create an admin user in Firebase Authentication
2. Set up custom claims for admin role (requires Firebase Functions)
3. Access admin dashboard at `/admin/login`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Environment Variables for Production
Make sure to set all environment variables in your hosting platform:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `OPENAI_API_KEY`

## 📊 API Routes

The application includes the following API routes:
- `POST /api/bookAppointment` - Book new appointments
- `GET /api/getDoctors` - Fetch doctors list
- `POST /api/contactMessage` - Send contact messages
- `POST /api/chatbot` - AI chatbot responses

## 🤖 Chatbot Features

The AI chatbot can help with:
- Clinic information (timings, location, contact)
- Appointment booking guidance
- Doctor information
- General health advice
- Service information

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure
```
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── contexts/               # React contexts (Auth)
├── lib/                    # Utility functions and Firebase config
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: info@newlifecare.com
- Phone: +91 97335 25031

## 🔄 Updates

Stay updated with the latest features and improvements by checking the repository regularly.

---

**New Life Care Midnapore** - Providing quality healthcare services with modern technology.
#   m y - t e s t - n e w 1  
 #   m y - t e s t - n e w 1  
 #   n e w l i f e c a r e . m a i d n a p u r e  
 #   n e x t - j s - s a m p l e - a p p  
 