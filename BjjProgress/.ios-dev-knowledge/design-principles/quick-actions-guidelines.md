# Home Screen Quick Actions - iOS Guidelines

**Source:** [Apple Developer - Home Screen Quick Actions](https://developer.apple.com/design/human-interface-guidelines/home-screen-quick-actions)  
**Last Updated:** December 2025  
**Note:** Curated summary from Apple's quick actions guidelines

---

## Overview

> "Home Screen quick actions give people a way to perform app-specific actions from the Home Screen."

**Access:** Long-press (3D Touch or Haptic Touch) on app icon

---

## Quick Actions Types

### Static Actions

Defined in `Info.plist` - always available

### Dynamic Actions

Added programmatically based on user behavior

---

## Design Guidelines

### Best Practices

✅ **Do:**

- Provide 1-4 most useful actions
- Use clear, action-oriented titles
- Include relevant SF Symbols
- Update dynamic actions based on usage
- Make actions immediately useful

❌ **Don't:**

- Add more than 4 actions (only 4 show)
- Use vague or generic titles
- Duplicate app features unnecessarily
- Include destructive actions
- Require additional steps

### Action Priority

1. **Most frequent tasks** - What users do daily
2. **Quick access** - Skip navigation steps
3. **Contextual** - Based on recent activity
4. **Useful shortcuts** - Common workflows

---

## Quick Actions for BJJ Progress

### Recommended Actions

#### 1. **Log Training** (Primary)

- **Icon:** Plus symbol
- **Title:** "Log Training"
- **Action:** Opens AddLog screen directly
- **Type:** Static

#### 2. **View Stats**

- **Icon:** Chart symbol
- **Title:** "View Stats"
- **Action:** Opens Stats screen
- **Type:** Static

#### 3. **Last Training** (Dynamic)

- **Icon:** Clock symbol
- **Title:** "Edit Last Training"
- **Action:** Opens most recent training log
- **Type:** Dynamic (only show if user has trainings)

#### 4. **Quick GI Log** (Future)

- **Icon:** Gi symbol
- **Title:** "Quick GI Session"
- **Action:** Pre-fills GI training form
- **Type:** Static

---

## Implementation (React Native)

### Using react-native-quick-actions

```bash
npm install react-native-quick-actions
```

### Static Actions (Info.plist)

```xml
<key>UIApplicationShortcutItems</key>
<array>
  <dict>
    <key>UIApplicationShortcutItemType</key>
    <string>com.bjjprogress.logtraining</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>Log Training</string>
    <key>UIApplicationShortcutItemIconType</key>
    <string>UIApplicationShortcutIconTypeAdd</string>
  </dict>
  <dict>
    <key>UIApplicationShortcutItemType</key>
    <string>com.bjjprogress.stats</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>View Stats</string>
    <key>UIApplicationShortcutItemIconType</key>
    <string>UIApplicationShortcutIconTypeCompose</string>
  </dict>
</array>
```

### Dynamic Actions (JavaScript)

```tsx
import QuickActions from "react-native-quick-actions";

// Add dynamic action for last training
const addLastTrainingAction = async (lastLog: TrainingLog) => {
  await QuickActions.setShortcutItems([
    {
      type: "com.bjjprogress.lasttraining",
      title: "Edit Last Training",
      subtitle: `${lastLog.type} - ${new Date(
        lastLog.date
      ).toLocaleDateString()}`,
      icon: "Time",
      userInfo: {
        logId: lastLog.$id,
      },
    },
  ]);
};

// Handle quick action
QuickActions.popInitialAction().then((action) => {
  if (action) {
    handleQuickAction(action);
  }
});

const handleQuickAction = (action: any) => {
  switch (action.type) {
    case "com.bjjprogress.logtraining":
      navigation.navigate("AddLog");
      break;
    case "com.bjjprogress.stats":
      navigation.navigate("Stats");
      break;
    case "com.bjjprogress.lasttraining":
      const logId = action.userInfo?.logId;
      // Navigate to edit screen with logId
      break;
  }
};
```

---

## SF Symbols for Actions

| Action       | SF Symbol             | Alternative                 |
| ------------ | --------------------- | --------------------------- |
| Log Training | `plus`                | `plus.circle.fill`          |
| View Stats   | `chart.bar.fill`      | `chart.line.uptrend.xyaxis` |
| Edit Last    | `clock.fill`          | `arrow.counterclockwise`    |
| Quick GI     | `figure.martial.arts` | `person.fill`               |

---

## User Experience Flow

### Without Quick Actions

```
1. Tap app icon
2. Wait for app to load
3. Navigate to AddLog
4. Fill form
```

### With Quick Actions

```
1. Long-press app icon
2. Tap "Log Training"
3. Fill form (skip navigation!)
```

**Time saved:** ~3-5 seconds per use

---

## Analytics & Optimization

### Track Quick Action Usage

```tsx
import analytics from "@react-native-firebase/analytics";

const handleQuickAction = (action: any) => {
  // Log analytics
  analytics().logEvent("quick_action_used", {
    action_type: action.type,
    timestamp: Date.now(),
  });

  // Handle action
  // ...
};
```

### Update Based on Usage

- If users frequently edit last training → keep dynamic action
- If rarely used → remove to reduce clutter
- Monitor which actions get most use

---

## Implementation Checklist

### Phase 1 (Essential)

- [ ] Add "Log Training" static action
- [ ] Add "View Stats" static action
- [ ] Handle quick action routing in App.tsx
- [ ] Test on physical device (simulator may not support)

### Phase 2 (Dynamic)

- [ ] Add "Edit Last Training" dynamic action
- [ ] Update action when new training logged
- [ ] Add analytics tracking

### Phase 3 (Advanced)

- [ ] Add "Quick GI Session" action
- [ ] Add "Quick NO-GI Session" action
- [ ] Personalize based on user's most common training type

---

## Testing

### Manual Testing

1. Build app on physical device
2. Long-press app icon
3. Verify actions appear
4. Tap each action
5. Verify correct screen opens

### Edge Cases

- [ ] App not running → cold start
- [ ] App in background → resume
- [ ] App in foreground → navigate
- [ ] No trainings logged → hide dynamic actions

---

## Best Practices Summary

| Guideline              | BJJ Progress Implementation     |
| ---------------------- | ------------------------------- |
| 1-4 actions            | ✅ 2-3 actions                  |
| Action-oriented titles | ✅ "Log Training", "View Stats" |
| SF Symbols             | ✅ Plus, Chart icons            |
| Dynamic updates        | ✅ "Edit Last Training"         |
| Immediate utility      | ✅ Skip navigation steps        |

---

## Resources

- **Documentation:** https://developer.apple.com/documentation/uikit/menus_and_shortcuts/add_home_screen_quick_actions
- **React Native Package:** https://github.com/jordanbyron/react-native-quick-actions
- **SF Symbols:** https://developer.apple.com/sf-symbols/

---

## Related Documents

- [iOS Design Guidelines](ios-design-guidelines.md)
- [Widgets Guidelines](widgets-guidelines.md)
- [Apple Design Resources](apple-design-resources.md)

---

**Priority:** Implement quick actions AFTER core app is stable. This is a nice-to-have feature that improves UX but isn't critical for launch.
