# FlashGenie

Welcome to FlashGenie - The easiest way to make flashcards from your text.

## Overview

FlashGenie is an AI-powered flashcard creation app that simplifies the process of studying. By leveraging OpenRouter's LLaMA API, FlashGenie breaks down your text into concise flashcards that are accessible anywhere, at any time. With integration with Stripe for paid services and Clerk for user authentication, FlashGenie offers a seamless experience for both free and paid users.

## Features

### Easy Text Input
Simply input your text and let our software do the rest. Creating flashcards has never been easier.

### Smart Flashcards
Our AI intelligently breaks down your text into concise flashcards, allowing you to study more effectively.

### Accessible Anywhere
Access your flashcards from any device, at any time. Study on the go with ease.

## Pricing

### Basic
- **Price**: $5 / month
- **Features**:
  - Access to basic flashcard features.
  - Limited storage.

### Pro
- **Price**: $10 / month
- **Features**:
  - Unlimited flashcards and storage.
  - Priority support.

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI API**: OpenRouter's LLaMA API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- Yarn or npm
- Vercel account
- Clerk account
- Stripe account
- OpenRouter API key

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/flashgenie.git
    cd flashgenie
    ```

2. **Install dependencies**:
    ```bash
    yarn install
    # or
    npm install
    ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory and add the following:

   ```bash
   NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>
   CLERK_API_KEY=<your-clerk-api-key>
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   NEXT_PUBLIC_OPENROUTER_API_KEY=<your-openrouter-api-key>
   NEXT_PUBLIC_VERCEL_URL=<your-vercel-deployment-url>

## Deployment

1. **Push your code to a GitHub repository**.

2. **Connect the repository to Vercel**:
   - Go to the [Vercel dashboard](https://vercel.com/dashboard).
   - Import your project from GitHub.
   - Add your environment variables in the Vercel project settings.

3. **Deploy**:
   - Vercel will automatically deploy your project after connecting your repository. Visit your Vercel deployment URL to see the live app.

## Usage

### Authentication
FlashGenie uses Clerk for user authentication. Users can sign up, log in, and manage their account directly within the app. User authentication is required to access and create flashcards.

### AI-Powered Flashcard Creation
Once logged in, users can input their text into the FlashGenie interface. The app will then use OpenRouter's LLaMA API to generate smart flashcards from the text.

### Payment Integration
FlashGenie offers two subscription plans: Basic and Pro. Stripe is used to handle payments. Users can manage their subscriptions within the app, and payments are securely processed through Stripe.

### Dark Theme with Glowing Teal Accents
FlashGenie is designed with a modern dark theme, featuring glowing teal accents that enhance the visual appeal and user experience.

## Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature
Contact
For any questions or support, please reach out to us at support@flashgenie.com.

