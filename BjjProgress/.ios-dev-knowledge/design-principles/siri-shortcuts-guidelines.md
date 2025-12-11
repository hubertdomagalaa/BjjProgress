# Siri Shortcuts & Suggestions - iOS Guidelines

**Source:** [Apple Developer - Siri](https://developer.apple.com/design/human-interface-guidelines/siri)  
**Last Updated:** December 2025  
**Note:** Curated summary from Apple's Siri guidelines

---

## Overview

> "Siri makes it easy for people to accomplish everyday tasks quickly, using voice, touch, or automation."

Siri Shortcuts allow users to:

- Trigger app actions with voice commands
- Create custom automations
- Access app features from Siri Suggestions

---

## Siri Shortcuts Types

### 1. **App Shortcuts**

Predefined actions users can trigger with Siri

### 2. **Custom Shortcuts**

User-created workflows in Shortcuts app

### 3. **Siri Suggestions**

Proactive suggestions based on usage patterns

---

## Best Practices

### Do's ✅

- Provide clear, action-oriented phrases
- Support natural language variations
- Show visual confirmation
- Handle errors gracefully
- Donate shortcuts when actions occur

### Don'ts ❌

- Require exact phrasing
- Make shortcuts too complex
- Ignore context
- Forget to handle permissions

---

## Siri Shortcuts for BJJ Progress

### Recommended Shortcuts

#### 1. **"Log Training"**

- **Phrase:** "Log my BJJ training"
- **Action:** Opens AddLog screen
- **Variations:** "Log BJJ session", "Add training"

#### 2. **"Show Stats"**

- **Phrase:** "Show my BJJ stats"
- **Action:** Opens Stats screen
- **Variations:** "BJJ progress", "Training stats"

#### 3. **"Last Training"**

- **Phrase:** "Show last training"
- **Action:** Opens most recent log
- **Variations:** "Recent training", "Latest session"

---

## Implementation

### Using react-native-siri-shortcut

```bash
npm install react-native-siri-shortcut
```

### Donate Shortcut

```tsx
import { donateShortcut, SiriShortcutItem } from "react-native-siri-shortcut";

// After user logs training
const donateLogTraining = async () => {
  const shortcut: SiriShortcutItem = {
    activityType: "com.bjjprogress.logtraining",
    title: "Log BJJ Training",
    userInfo: {},
    keywords: ["bjj", "training", "log", "session"],
    persistentIdentifier: "logTraining",
    isEligibleForSearch: true,
    isEligibleForPrediction: true,
    suggestedInvocationPhrase: "Log my BJJ training",
  };

  await donateShortcut(shortcut);
};
```

### Handle Shortcut

```tsx
// App.tsx
import { useEffect } from "react";
import { getShortcuts } from "react-native-siri-shortcut";

useEffect(() => {
  getShortcuts().then((shortcuts) => {
    shortcuts.forEach((shortcut) => {
      if (shortcut.activityType === "com.bjjprogress.logtraining") {
        navigation.navigate("AddLog");
      }
    });
  });
}, []);
```

---

## Siri Suggestions

### When to Donate

- ✅ After logging training
- ✅ After viewing stats
- ✅ After editing training
- ✅ After opening app frequently

### Suggestion Timing

Siri learns patterns and suggests shortcuts:

- Same time every day
- Same location (gym)
- After specific events

---

## Voice Phrases

### Natural Language Examples

| User Says                    | App Action           |
| ---------------------------- | -------------------- |
| "Log my BJJ training"        | Open AddLog          |
| "Show my BJJ stats"          | Open Stats           |
| "What's my training streak?" | Show streak widget   |
| "Log a GI session"           | Pre-fill GI training |

---

## Implementation Checklist

### Phase 1 (Essential)

- [ ] Install react-native-siri-shortcut
- [ ] Donate "Log Training" shortcut
- [ ] Handle shortcut in App.tsx
- [ ] Test with "Hey Siri, log my BJJ training"

### Phase 2 (Enhanced)

- [ ] Add "Show Stats" shortcut
- [ ] Add "Last Training" shortcut
- [ ] Donate after each action
- [ ] Add to Shortcuts app

### Phase 3 (Advanced)

- [ ] Custom parameters (GI/NO-GI)
- [ ] Voice confirmation
- [ ] Siri Suggestions
- [ ] Automation support

---

## User Experience

### Without Siri

```
1. Unlock phone
2. Find app
3. Open app
4. Navigate to AddLog
5. Fill form
```

### With Siri

```
1. "Hey Siri, log my BJJ training"
2. Fill form
```

**Time saved:** ~10-15 seconds

---

## Resources

- **SiriKit Documentation:** https://developer.apple.com/documentation/sirikit
- **Shortcuts Documentation:** https://developer.apple.com/documentation/appintents
- **React Native Package:** https://github.com/Sh1d0w/react-native-siri-shortcut

---

## Related Documents

- [Quick Actions Guidelines](quick-actions-guidelines.md)
- [Widgets Guidelines](widgets-guidelines.md)
- [iOS Design Guidelines](ios-design-guidelines.md)

---

**Priority:** Implement Siri Shortcuts after core app is stable. Great for power users but not critical for launch.
