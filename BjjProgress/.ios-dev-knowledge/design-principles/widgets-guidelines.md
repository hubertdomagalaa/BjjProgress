# iOS Widgets - Design Guidelines

**Source:** [Apple Developer - Widgets HIG](https://developer.apple.com/design/human-interface-guidelines/widgets)  
**Last Updated:** December 2025  
**Note:** Curated summary from Apple's widget guidelines

---

## Overview

> "A widget elevates and displays a small amount of timely, relevant information from your app or game so people can see it at a glance in additional contexts."

Widgets appear on:

- iPhone Home Screen
- iPad Home Screen
- Lock Screen
- StandBy mode
- macOS Notification Center

---

## Widget Design Principles

### 1. **Glanceable**

- Show information at a glance
- No scrolling or interaction required
- Update automatically

### 2. **Timely**

- Display relevant, up-to-date information
- Refresh at appropriate intervals
- Show what matters now

### 3. **Focused**

- Single purpose per widget
- Don't try to show everything
- Prioritize most important data

---

## Widget Sizes

### iPhone & iPad

- **Small** - 2x2 grid (158x158 pts on iPhone 14)
- **Medium** - 2x4 grid (338x158 pts on iPhone 14)
- **Large** - 4x4 grid (338x354 pts on iPhone 14)
- **Extra Large** - iPad only (795x795 pts)

### Lock Screen (iOS 16+)

- **Circular** - Small circular widget
- **Rectangular** - Inline widget
- **Inline** - Text-based widget

---

## Widget Best Practices

### Content

✅ **Do:**

- Show dynamic, meaningful data
- Use clear, concise text
- Display relevant images
- Update regularly

❌ **Don't:**

- Show static content
- Include interactive elements (buttons, switches)
- Display too much information
- Use as app launcher only

### Visual Design

✅ **Do:**

- Use your app's color scheme
- Maintain visual hierarchy
- Support light and dark modes
- Use SF Symbols for icons

❌ **Don't:**

- Overcrowd with information
- Use tiny, unreadable text
- Ignore safe areas
- Replicate entire app UI

### Updates

✅ **Do:**

- Refresh at meaningful intervals
- Use background updates
- Show loading states briefly
- Handle errors gracefully

❌ **Don't:**

- Update too frequently (battery drain)
- Show stale data
- Leave widgets blank
- Require manual refresh

---

## Widget for BJJ Progress App

### Potential Widget Ideas

#### 1. **Training Streak Widget** (Small)

```
┌─────────────┐
│  🔥 Streak  │
│             │
│     7       │
│   DAYS      │
│             │
│ Last: Today │
└─────────────┘
```

#### 2. **This Week Stats** (Medium)

```
┌─────────────────────────────┐
│  This Week                  │
│                             │
│  🥋 5 trainings             │
│  ⏱️ 450 min                 │
│  🤼 12 sparrings            │
└─────────────────────────────┘
```

#### 3. **Recent Training** (Large)

```
┌─────────────────────────────┐
│  Last Training              │
│                             │
│  Dec 8 • GI • 90 min       │
│                             │
│  Submissions: 3             │
│  Sweeps: 2                  │
│  Positions: Guard, Mount    │
│                             │
│  Notes: Great session!      │
└─────────────────────────────┘
```

#### 4. **Lock Screen Widget** (Circular)

```
  ┌───┐
  │ 7 │  ← Training streak
  └───┘
```

---

## Implementation (React Native)

### Using react-native-widget-extension

```bash
npm install react-native-widget-extension
```

### Widget Configuration

```tsx
// widget.tsx
import { WidgetPreview } from "react-native-widget-extension";

export const TrainingStreakWidget = () => {
  return (
    <WidgetPreview widgetName="TrainingStreak" family="small">
      <View style={styles.container}>
        <Text style={styles.emoji}>🔥</Text>
        <Text style={styles.number}>{streak}</Text>
        <Text style={styles.label}>DAYS</Text>
      </View>
    </WidgetPreview>
  );
};
```

### Timeline Provider

```swift
// WidgetProvider.swift
struct Provider: TimelineProvider {
    func getTimeline(completion: @escaping (Timeline<Entry>) -> ()) {
        // Fetch training data
        // Create timeline entries
        // Update every hour
    }
}
```

---

## Widget Refresh Strategy

### BJJ Progress Widget Updates

| Widget          | Update Frequency | Trigger                   |
| --------------- | ---------------- | ------------------------- |
| Training Streak | Every 6 hours    | Background refresh        |
| This Week Stats | Every 2 hours    | After new training logged |
| Recent Training | On demand        | When app opens            |
| Lock Screen     | Every 1 hour     | Background refresh        |

### Background Refresh

```swift
// Set refresh interval
let timeline = Timeline(
    entries: entries,
    policy: .after(Date().addingTimeInterval(3600)) // 1 hour
)
```

---

## Design Checklist

### Before Implementing Widgets

- [ ] Identify most valuable data to display
- [ ] Design for all widget sizes
- [ ] Create light and dark mode variants
- [ ] Plan refresh strategy
- [ ] Consider battery impact

### Widget Design

- [ ] Clear visual hierarchy
- [ ] Readable text sizes (minimum 11pt)
- [ ] Proper spacing and padding
- [ ] SF Symbols for icons
- [ ] App branding (colors, style)

### Technical

- [ ] Background refresh configured
- [ ] Error states handled
- [ ] Loading states designed
- [ ] Deep linking to app
- [ ] Data persistence

---

## Resources

- **WidgetKit Documentation:** https://developer.apple.com/documentation/widgetkit
- **WWDC Sessions:**
  - [Meet WidgetKit](https://developer.apple.com/videos/play/wwdc2020/10028/)
  - [Complications and widgets: Reloaded](https://developer.apple.com/videos/play/wwdc2022/10050/)
- **React Native Widget Extension:** https://github.com/rnwidget/react-native-widget-extension

---

## Future Enhancement for BJJ Progress

### Phase 1 (After 1,000 Users)

- [ ] Training streak widget (small)
- [ ] This week stats (medium)

### Phase 2 (After Subscription Launch)

- [ ] Recent training widget (large)
- [ ] Lock screen widgets
- [ ] Interactive widgets (iOS 17+)

### Phase 3 (Advanced)

- [ ] Configurable widgets
- [ ] Multiple widget variants
- [ ] Live Activities for active training

---

## Related Documents

- [iOS Design Guidelines](ios-design-guidelines.md)
- [Apple Design Resources](apple-design-resources.md)
- [iOS Getting Started](ios-getting-started.md)

---

**Note:** Widgets are a great way to increase user engagement, but implement them AFTER your core app is stable and approved by Apple. Focus on getting your first 1,000 users first!
