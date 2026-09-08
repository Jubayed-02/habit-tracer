# 🔥 Habit Tracer

A beautiful and feature-rich habit tracking app built with React Native and Expo. Track your daily habits, build streaks, and stay motivated with detailed statistics and progress visualization.

## ✨ Features

### Core Features
- **Habit Management** - Add, edit, and delete habits with categories and notes
- **Streak Tracking** - Build daily streaks with automatic reset and history
- **Weekly Progress** - Visual circles showing last 7 days (Friday to Thursday)
- **Notifications** - Daily reminders with "last chance" alerts at 11:55 PM
- **Statistics Dashboard** - Donut chart, progress bars, and completion rates
- **Profile System** - Custom avatar, name, and occupation
- **Dark Mode** - Automatically follows system theme
- **Data Persistence** - All data saved locally with AsyncStorage

### User Experience
- **Long press** habit card to edit/delete
- **Undo option** for 4 seconds after completing a habit
- **Discard warning** when closing modals with unsaved changes
- **Two-step Add modal** for clean onboarding
- **Auto-shrink FAB** - Label shows for 5s, shrinks to "+", returns after 30s
- **Animated cards** - Slide-in and fade on load
- **Animated charts** - Donut chart draws itself, progress bars fill smoothly
- **Help/Manual page** - Built-in instructions

## 📸 Screenshots

*(Add screenshots here)*

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native | Cross-platform mobile framework |
| Expo SDK 57 | Development platform |
| TypeScript | Type-safe code |
| React Native Paper | UI component library |
| AsyncStorage | Local data persistence |
| Expo Notifications | Daily reminders |
| React Native SVG | Donut chart rendering |
| Animated API | Animations |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Android device (for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/Jubayed-02/habit-tracer.git

# Navigate to project
cd habit-tracer

# Install dependencies
npm install

# Start development server
npx expo start
