# BJJ Progress - Project Context & Overview

**Project Name:** BJJ Progress  
**Developer:** Hubert Domagala  
**Platform:** iOS (React Native / Expo)  
**Status:** Submitted to Apple App Store (Awaiting Approval)  
**Version:** 1.0.0  
**Last Updated:** December 2025

---

## Project Overview

BJJ Progress is a comprehensive training log and progress tracking application designed specifically for Brazilian Jiu-Jitsu practitioners. The app allows users to track their training sessions, sparring data, techniques, competitions, and overall progress in their BJJ journey.

### Purpose

- Help BJJ practitioners track their training consistency
- Analyze progress over time with detailed statistics
- Log sparring sessions with specific techniques and outcomes
- Track competition results
- Monitor training streaks and habits

### Target Audience

- BJJ practitioners of all belt levels
- Martial artists wanting structured training logs
- Athletes tracking performance metrics
- Coaches monitoring student progress

---

## Tech Stack

### Frontend Framework

- **React Native** (via Expo)
  - Version: Latest Expo SDK
  - Language: TypeScript
  - UI: React Native + NativeWind (Tailwind CSS)

### Navigation

- **React Navigation** v6
  - Stack Navigator for main screens
  - Bottom Tab Navigator planned for future

### Backend & Database

- **Appwrite** (Cloud BaaS)
  - Authentication (email/password)
  - Database (NoSQL)
  - Storage for future features
  - Real-time sync across devices

### State Management

- **React Query (TanStack Query)**
  - Data fetching and caching
  - Offline support
  - Optimistic updates

### Analytics & Monitoring

- **PostHog** - User analytics
- **Sentry** - Crash reporting
- **Expo Analytics** - Basic metrics

### Internationalization

- **i18next** + **react-i18next**
  - Currently supports: English, Polish
  - Easily extensible for more languages

### Styling

- **NativeWind** (Tailwind for React Native)
- **Custom fonts:** Bebas Neue, Inter, Lato
- **Linear gradients, animations**

---

## Architecture

### Project Structure

```
BjjProgress/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens
│   ├── contexts/        # React contexts (User, Language)
│   ├── utils/           # Utilities, helpers
│   ├── types/           # TypeScript types
│   ├── i18n/            # Translations
│   └── styles/          # Style utilities
├── assets/              # Images, fonts
├── app.json             # Expo config
└── App.tsx              # Entry point
```

### Key Screens

1. **HomeScreen** - Training logs list, stats overview
2. **AddLogScreen** - Log new training session
3. **StatsScreen** - Detailed analytics and charts
4. **ProfileScreen** - User profile, belt, settings
5. **SettingsScreen** - App settings, account management
6. **PaywallScreen** - Subscription (disabled for iOS launch)
7. **PrivacyPolicyScreen** - Privacy policy
8. **TermsScreen** - Terms of service

### Data Models

```typescript
TrainingLog {
  $id: string
  user_id: string
  date: string
  duration: number
  type: 'GI' | 'NO-GI' | 'COMP'
  notes?: string
  reflection?: string
  tournament_name?: string
  weight_class?: string
  location?: string
  competition_style?: 'GI' | 'NO-GI'
}

SparringSession {
  $id: string
  training_log_id: string
  partner_name: string
  partner_belt: string
  rounds: number
  submissions_attempted: number
  submissions_successful: number
  sweeps: number
  positions: string[]
  notes?: string
}
```

---

## Key Features

### Core Features (v1.0)

- ✅ User authentication (email/password)
- ✅ Training log CRUD operations
- ✅ GI, NO-GI, and Competition tracking
- ✅ Sparring session details
- ✅ Training stats and analytics
- ✅ Training streak tracking
- ✅ Offline support
- ✅ Multi-language (EN, PL)
- ✅ Dark theme

### Premium Features (Future - After 1,000 Users)

- 🔜 Advanced analytics
- 🔜 Technique library
- 🔜 Goal setting
- 🔜 Progress photos
- 🔜 Export data (CSV, PDF)
- 🔜 Cloud backup

### iOS-Specific Features (Planned)

- 🔜 Home Screen Widgets
- 🔜 Quick Actions (3D Touch)
- 🔜 Siri Shortcuts
- 🔜 Share Sheet integration
- 🔜 Lock Screen widgets

---

## Current Status

### App Store Submission

- **Status:** Submitted to Apple (Dec 9, 2025)
- **Build:** Production build via EAS
- **Previous Rejection:** Fixed all issues
  - ✅ TypeScript errors resolved
  - ✅ iPad layout fixed
  - ✅ Subscription disabled for iOS
  - ✅ Privacy policy accessible
  - ✅ Terms of service accessible

### Launch Strategy

- **Phase 1:** Free for first 1,000 users
- **Phase 2:** Add subscription at $4.99/month
- **Goal:** Grow through BJJ community (Reddit, Instagram, local gyms)

---

## React Native vs Native Development

### Current: React Native (Expo)

#### ✅ Advantages

1. **Single Codebase**

   - Write once, deploy to iOS and Android
   - 90% code sharing between platforms
   - Faster development (1 developer vs 2)

2. **Development Speed**

   - Hot reload for instant feedback
   - Large library ecosystem (npm)
   - TypeScript for type safety
   - Easier to prototype and iterate

3. **Cost Effective**

   - One developer can build both platforms
   - No need for Mac + PC
   - Lower maintenance cost

4. **Community & Support**

   - Massive React Native community
   - Expo simplifies configuration
   - Regular updates and improvements

5. **Good Enough Performance**
   - 60fps UI for most use cases
   - Native modules for heavy tasks
   - Hermes JavaScript engine (fast)

#### ⚠️ Disadvantages

1. **Performance Limitations**

   - JavaScript bridge overhead
   - Not ideal for games or heavy animations
   - Larger app size (~40-50MB)

2. **Platform-Specific Features**

   - Some native features require custom native code
   - Delayed support for new iOS/Android features
   - Home Screen widgets need native implementation

3. **App Size**

   - React Native apps are typically larger
   - BJJ Progress: ~45MB (could be 10-15MB native)

4. **Update Dependency**
   - Waiting for Expo/RN to support new OS features
   - Potential breaking changes in updates

---

### Future: Native Development (Swift + Kotlin)

#### ✅ When to Consider Native

**Recommend switching to native if:**

1. **Performance Issues** (Not currently a problem)

   - App becomes laggy or slow
   - Complex animations needed
   - Heavy data processing

2. **Platform-Specific Features Needed**

   - Advanced iOS features (WidgetKit, Live Activities)
   - Deep OS integration
   - Platform-specific UX patterns

3. **App Size Matters**

   - Users complain about app size
   - Need to reduce download barrier
   - Targeting data-constrained markets

4. **Scale Requires It**
   - 100,000+ users with performance needs
   - Team grows to support separate iOS/Android devs
   - Revenue justifies 2x development cost

#### ❌ When NOT to Switch

**Stay with React Native if:**

1. **Current Performance is Good**

   - App runs smoothly at 60fps
   - No user complaints about speed
   - Loading times are acceptable

2. **Solo Developer or Small Team**

   - Can't afford 2 developers
   - Need to ship features quickly
   - Maintaining 2 codebases is too costly

3. **Budget Constraints**

   - Startup/bootstrap phase
   - Under 10,000 users
   - Not yet profitable

4. **Rapid Iteration Needed**
   - Testing product-market fit
   - Frequent feature experiments
   - A/B testing UI/UX

---

## Decision Framework: React Native vs Native

### For BJJ Progress Specifically

#### Current Recommendation: STAY WITH REACT NATIVE

**Reasoning:**

- ✅ App performs well (no performance issues)
- ✅ Solo developer (you)
- ✅ Early stage (pre-launch)
- ✅ Need rapid iteration for user feedback
- ✅ Budget-conscious (bootstrap)
- ✅ React Native ecosystem is mature

**Timeline:**

- **Year 1 (0-1,000 users):** React Native
- **Year 2 (1,000-10,000 users):** React Native (still)
- **Year 3+ (10,000+ users):** Re-evaluate

#### Future Native Rewrite Triggers

**Consider rewriting to Swift/Kotlin if:**

1. **Revenue milestone:** $10,000+/month recurring
2. **User base:** 50,000+ active users
3. **Team size:** Can hire iOS + Android developers
4. **Performance complaints:** Users reporting lag/crashes
5. **Feature limitations:** Need advanced native features

**Estimated Cost of Native Rewrite:**

- **Development time:** 6-12 months (both platforms)
- **Cost:** $50,000-$150,000 (if outsourced)
- **Maintenance:** 2x ongoing cost (2 codebases)

---

## Hybrid Approach (Best of Both Worlds)

### Recommended Strategy

**Keep React Native + Add Native Modules for Specific Features**

#### What to Keep in React Native:

- ✅ Core app logic
- ✅ UI screens
- ✅ Data management
- ✅ Business logic

#### What to Build Native:

- 🔵 Home Screen Widgets (Swift/Kotlin)
- 🔵 Siri Shortcuts (Swift)
- 🔵 Quick Actions (Swift/Kotlin)
- 🔵 Share extensions (Swift/Kotlin)
- 🔵 Lock Screen widgets (Swift)

**This gives you:**

- Native feel for OS integration
- Fast development for core features
- Best performance where needed
- Single codebase for business logic

---

## Technology Comparison Table

| Feature               | React Native (Current)  | Native (Swift/Kotlin)      |
| --------------------- | ----------------------- | -------------------------- |
| **Development Speed** | ⭐⭐⭐⭐⭐ Fast         | ⭐⭐⭐ Moderate            |
| **Performance**       | ⭐⭐⭐⭐ Good           | ⭐⭐⭐⭐⭐ Excellent       |
| **App Size**          | ⭐⭐⭐ Larger (~45MB)   | ⭐⭐⭐⭐⭐ Smaller (~15MB) |
| **Platform Features** | ⭐⭐⭐ Some delay       | ⭐⭐⭐⭐⭐ Immediate       |
| **Developer Cost**    | ⭐⭐⭐⭐⭐ 1 developer  | ⭐⭐ 2 developers          |
| **Maintenance**       | ⭐⭐⭐⭐ 1 codebase     | ⭐⭐ 2 codebases           |
| **Community Support** | ⭐⭐⭐⭐⭐ Huge         | ⭐⭐⭐⭐ Platform-specific |
| **UI Consistency**    | ⭐⭐⭐⭐ Cross-platform | ⭐⭐⭐⭐⭐ Platform-native |

---

## Recommendations

### Short-term (Next 6-12 months)

1. ✅ **Stay with React Native**
2. ✅ **Focus on user acquisition** (get to 1,000 users)
3. ✅ **Iterate based on feedback**
4. ✅ **Add native modules** for widgets/shortcuts
5. ✅ **Optimize performance** in React Native

### Medium-term (Year 2)

1. 🔵 **Evaluate performance** at 10,000 users
2. 🔵 **Consider native widgets** (Swift WidgetKit)
3. 🔵 **Hire iOS developer** if revenue supports it
4. 🔵 **Keep React Native** for core app

### Long-term (Year 3+)

1. 🔵 **Re-evaluate** if revenue justifies rewrite
2. 🔵 **Consider native** only if:
   - Revenue > $10k/month
   - Users > 50,000
   - Performance issues persist
   - Team can support 2 codebases

---

## Conclusion

**For BJJ Progress, React Native is the right choice NOW and for the foreseeable future (1-2 years minimum).**

**Reasons:**

- Solo developer efficiency
- Rapid iteration capability
- Cost-effective development
- Good-enough performance
- Proven tech stack
- Large community support

**Re-evaluate native rewrite only when:**

- Revenue justifies 2x development cost
- User base demands better performance
- Team size supports separate iOS/Android developers

**Hybrid approach (React Native + Native modules) is the sweet spot** for adding platform-specific features without full rewrite.

---

## Additional Resources

- [iOS Development Knowledge Base](../.ios-dev-knowledge/)
- [Pre-Launch Checklist](../../.gemini/antigravity/brain/37b4494d-9845-497d-9357-af4a8576f318/pre_launch_checklist.md)
- [Post-Launch Strategy](../../.gemini/antigravity/brain/37b4494d-9845-497d-9357-af4a8576f318/post_launch_strategy.md)
- [React Native Performance Guide](https://reactnative.dev/docs/performance)
- [Expo Native Modules](https://docs.expo.dev/modules/overview/)
