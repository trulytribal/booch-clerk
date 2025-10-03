Booch: Kombucha Tracker - Build Plan
This document outlines the complete plan for building "Booch," a full-stack React Native application for tracking kombucha fermentations. The architecture, code style, and technology stack are based on the "Full Stack React Native Uber Clone" tutorial.

This plan is divided into two parts:

Manual Setup & Configuration: Steps for you to complete to initialize the project, install dependencies, and set up environment variables.

LLM Build Instructions: A detailed, step-by-step guide for your AI coding assistant to generate the application code.

1. Manual Setup & Configuration
   Follow these steps to prepare the project environment before instructing the AI.

A. Project Initialization
Open your terminal and create a new Expo project with TypeScript.

npx create-expo-app@latest booch --template

When prompted, select the "Blank (TypeScript)" template.

Navigate into the new project directory.

cd booch

B. NPM Package Installation
Install all the necessary dependencies for the project using a single command.

npm install nativewind tailwindcss zustand @clerk/clerk-expo expo-secure-store @neondatabase/serverless @stripe/stripe-react-native @gorhom/bottom-sheet react-native-gesture-handler react-native-reanimated

C. Environment Variables
Create a file named .env in the root of your project and add the following keys. You will need to get these values from their respective services (Clerk, Neon, Stripe).

# Clerk Authentication

EXPO*PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test*..."

# Neon Serverless Postgres Database

DATABASE_URL="postgres://user:password@endpoint.neon.tech/dbname?sslmode=require"

# Stripe Payments

EXPO*PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test*..."
STRIPE*SECRET_KEY="sk_test*..."

# Expo API Routes (use your own domain or a placeholder for local dev)

EXPO_PUBLIC_SERVER_URL="[https://booch.app](https://booch.app)"

D. Initial Project Configuration
Tailwind CSS: Initialize Tailwind for Native Wind.

npx tailwindcss init

Then, update the generated tailwind.config.js to scan your project files:

// tailwind.config.js
/**@type {import('tailwindcss').Config} \*/
module.exports = {
content: ["./app/**/_.{js,jsx,ts,tsx}", "./components/\*\*/_.{js,jsx,ts,tsx}"],
theme: {
extend: {},
},
plugins: [],
}

Babel: Add the Native Wind plugin to your babel.config.js:

// babel.config.js
module.exports = function (api) {
api.cache(true);
return {
presets: ["babel-preset-expo"],
plugins: ["nativewind/babel"], // Add this line
};
};

Expo Config: Modify your app.json to enable the server output for API routes and define a URL scheme.

// app.json
{
"expo": {
// ... other properties
"scheme": "booch",
"web": {
"bundler": "metro",
"output": "server" // Change this from "single"
},
"plugins": [
[
"expo-router",
{
"origin": "[https://booch.app](https://booch.app)" // Match your EXPO_PUBLIC_SERVER_URL
}
]
]
}
}

You are now ready to start the build process with your AI assistant.

2. LLM Build Instructions
   Step 1: Project Structure and Cleanup
   Create Folders: Generate the following directory structure in the project root:

app/ (will contain routes)

api/ (for Expo API Routes)

components/ (for reusable UI components)

constants/ (for static assets and data)

lib/ (for utility functions and helpers)

store/ (for Zustand state management)

types/ (for TypeScript type definitions)

Initial Cleanup: Delete the default app/(tabs) folder and the app/modal.tsx file created by the template. We will rebuild this from scratch.

Root Layout: Create app/\_layout.tsx. This will be the root of the application.

Wrap the entire app in a ClerkProvider. Use the EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY from the environment variables.

Implement the token caching mechanism using expo-secure-store, placing the logic in a new file at lib/auth.ts.

Use a Stack navigator from expo-router. Define screens for (tabs) and (auth) route groups, with headerShown: false.

Entry Point: Create app/index.tsx.

This file should contain no UI. Its only job is to redirect the user.

Use the useAuth hook from Clerk. If isSignedIn, redirect to /(tabs)/home. If not, redirect to /(auth)/signin.

Step 2: Database Schema (SQL)
Generate a file named schema.sql in the project root containing the CREATE TABLE statements for our PostgreSQL database. Use snake_case for all table and column names.

-- schema.sql

-- Users table linked to Clerk
CREATE TABLE users (
id SERIAL PRIMARY KEY,
clerk_id VARCHAR(255) UNIQUE NOT NULL,
email VARCHAR(255) UNIQUE,
first_name VARCHAR(255),
is_pro BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- First Fermentation Batches
CREATE TABLE batches (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
name VARCHAR(255) NOT NULL,
start_date_f1 DATE NOT NULL,
end_date_f1 DATE,
tea_type VARCHAR(100),
sugar_grams INTEGER,
status VARCHAR(50) DEFAULT 'F1' NOT NULL, -- F1, F2, Completed
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Second Fermentation Bottles
CREATE TABLE bottles (
id SERIAL PRIMARY KEY,
batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
bottling_date DATE NOT NULL,
flavor_ingredients TEXT,
status VARCHAR(50) DEFAULT 'F2' NOT NULL, -- F2, Consumed
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasting Notes for each bottle
CREATE TABLE tasting_notes (
id SERIAL PRIMARY KEY,
bottle_id INTEGER REFERENCES bottles(id) ON DELETE CASCADE,
tasting_date DATE NOT NULL,
fizz_rating INTEGER CHECK (fizz_rating >= 1 AND fizz_rating <= 5),
sweetness_rating INTEGER CHECK (sweetness_rating >= 1 AND sweetness_rating <= 5),
tartness_rating INTEGER CHECK (tartness_rating >= 1 AND tartness_rating <= 5),
notes TEXT,
overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

Step 3: Reusable Components
Create the following reusable components in the /components directory. Style them using Native Wind classes.

CustomButton.tsx:

Accepts title, onPress, containerStyles, textStyles, isLoading props.

Should be a TouchableOpacity. If isLoading is true, show an ActivityIndicator instead of the title.

InputField.tsx:

A view containing a Text label and a TextInput.

Accepts title (for the label), value, placeholder, handleChangeText, and otherStyles.

Step 4: Authentication Flow
Auth Layout: Create the auth route group by creating app/(auth)/\_layout.tsx. It should be a simple Stack navigator with headerShown: false.

Sign-In Screen: Create app/(auth)/signin.tsx.

Use InputField components for Email and Password.

Use CustomButton for the "Sign In" action.

Implement the sign-in logic using Clerk's useSignIn hook.

Include a "Login with Google" button. Implement the Google OAuth flow following the tutorial's pattern.

Provide a link to the sign-up page.

Sign-Up Screen: Create app/(auth)/signup.tsx.

Use InputFields for Email and Password.

Implement the sign-up logic using Clerk's useSignUp hook, including email verification.

Also include a "Sign up with Google" button.

User API Route: Create api/user/+api.ts.

This route will handle a POST request.

It should accept a clerk_id, email, and first_name.

Write a raw SQL query to INSERT a new user into the users table.

Connect Auth to DB: Modify the sign-up logic (in signup.tsx) and the Google OAuth logic. After a successful user creation in Clerk (createdUserId), make a POST request to /api/user to sync the new user to your PostgreSQL database.

Step 5: Main Application Tabs
Tabs Layout: Create app/(tabs)/\_layout.tsx.

Use the Tabs navigator from expo-router.

Create a custom tab bar component that styles the icons and labels, making the active tab visually distinct, similar to the tutorial.

Define three tabs: home, new-batch, and profile.

Dashboard Screen: Create app/(tabs)/home.tsx.

This screen will display a list of the user's kombucha batches.

Create an API route api/batches/[userId]+api.ts that handles a GET request. Write a SQL query to SELECT all batches from the batches table where user_id matches the provided ID.

In home.tsx, create a custom useFetch hook in lib/fetch.ts to manage API calls, loading, and error states, just like the tutorial. Use this hook to call your new API route.

Display the batches using a FlatList. Each item in the list should be a BatchCard.tsx component (which you'll create next).

If the list is empty, show a message prompting the user to start their first batch.

Batch Card Component: Create components/BatchCard.tsx.

This component should display summary information for a batch: name, status (F1, F2, etc.), and start_date_f1.

Make the entire card a TouchableOpacity that navigates to the batch detail screen: /batch/${batch.id}.

Step 6: Core Features - Batch Management
New Batch Screen: Create app/(tabs)/new-batch.tsx.

Build a simple form using InputField and CustomButton.

Fields: Batch Name, Tea Type, Sugar Amount, Start Date (use a date picker component or a simple text input for now).

Create an API route api/batches/create+api.ts to handle a POST request. It should write a new record to the batches table.

When the "Start Fermentation" button is pressed, call this API route and then navigate the user back to the home screen.

Batch Detail Screen: Create a dynamic route at app/batch/[id].tsx.

Fetch the detailed data for the specific batch using its ID, including any associated bottles and tasting notes. You may need to create a new API route for this that performs SQL JOINs.

Display all F1 details.

Conditional Workflow:

If batch.status is 'F1', show a button "Start Second Fermentation". Pressing this should trigger an API call to update the batch status to 'F2' and end_date_f1.

Once the status is 'F2', show a new section for adding bottles. This section will have a form to input flavor_ingredients and a button to "Add Bottle". This will create new records in the bottles table.

Display a list of all bottles for this batch. Each bottle item should have a button: "Log Tasting Notes".

Clicking "Log Tasting Notes" should open a modal or navigate to a new screen with a form for fizz_rating, sweetness_rating, etc. Submitting this form creates a new record in the tasting_notes table.

Step 7: Stripe Integration for "Booch Pro"
Profile Screen: Create app/(tabs)/profile.tsx.

Display the user's email and a "Sign Out" button.

Add a section that conditionally renders based on the user.is_pro field.

If is_pro is false, show a "Upgrade to Booch Pro" button.

If is_pro is true, show a "You are a Pro member!" message.

Payment Flow:

When the "Upgrade" button is pressed, navigate to a new screen app/pro-checkout.tsx.

Stripe API Routes: In the /api/stripe directory, create the API routes needed to create a payment intent, following the tutorial's implementation.

Checkout Screen: On the pro-checkout.tsx screen, implement the Stripe payment sheet using @stripe/stripe-react-native.

Use the Payment.tsx component pattern from the tutorial.

Update User Status: After a successful payment, make an API call to an endpoint (e.g., api/user/upgrade/+api.ts) that updates the is_pro field for the current user in your PostgreSQL database to TRUE.
