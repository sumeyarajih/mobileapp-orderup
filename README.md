🍔 Overview

OrderUp simplifies online food ordering by connecting users with restaurants in their area.
It provides real-time order tracking, secure payments, and a seamless user experience across both Android and iOS.

🚀 Key Features

✅ Browse Restaurants – View available restaurants with images and ratings.
✅ Menu & Categories – Explore detailed menus by category (Burgers, Drinks, Desserts, etc.).
✅ Add to Cart – Select and customize food items (size, extras, quantity).
✅ Order Tracking – Track your order status in real time.
✅ User Authentication – Login, signup, and profile management.
✅ Search & Filter – Quickly find your favorite dishes.
✅ Dark Mode Support (optional)
✅ Secure Payment Integration (to be implemented later)

🧱 Project Structure
OrderUp/
 ┣ android/                 # Native Android project
 ┣ ios/                     # Native iOS project
 ┣ src/
 ┃ ┣ assets/                # Images, icons, fonts
 ┃ ┣ components/            # Reusable UI components (buttons, cards, etc.)
 ┃ ┣ navigation/            # App navigation (React Navigation setup)
 ┃ ┣ screens/               # App screens (Home, Cart, Profile, etc.)
 ┃ ┣ services/              # API calls & backend communication
 ┃ ┗ utils/                 # Helper functions, constants
 ┣ App.tsx                  # Root component
 ┣ package.json             # Dependencies & scripts
 ┣ babel.config.js          # Babel configuration
 ┣ metro.config.js          # Metro bundler config
 ┣ tsconfig.json            # TypeScript configuration
 ┗ README.md                # Project documentation

⚙️ Tech Stack

Frontend: React Native (TypeScript)

State Management: React Hooks / Context API (or Redux)

Backend: Next.js API (or Node.js + Express)

Database:  PostgreSQL

Payment: Chapa or arif pay

Authentication: Firebase Auth or JWT-based login

🪄 Setup & Installation

Clone the repository

git clone https://github.com/yourusername/OrderUp.git
cd OrderUp


Install dependencies

npm install
# or
yarn install


Run Metro Bundler

npx react-native start


Run the app

npx react-native run-android
# or
npx react-native run-ios

🔗 Backend Setup (Next.js Example)

Your backend API (e.g., /backend folder) handles:

User registration & login

Restaurant and menu data

Order processing & tracking

Payment integration

You can create a Next.js backend separately using:

npx create-next-app@latest backend

💡 Future Improvements

Push notifications for order updates

Live chat with restaurants

Real-time delivery tracking on map

Loyalty points and discounts system

Admin dashboard for restaurant owners

👩‍💻 Developer

Sumeya Rajih
📍 Dire Dawa University – Software Engineering
📧 sumeyarajih@gmail.com
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
