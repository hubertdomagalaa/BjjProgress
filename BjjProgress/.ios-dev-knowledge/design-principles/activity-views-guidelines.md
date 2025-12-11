# Activity Views (Share Sheet) - iOS Guidelines

**Source:** [Apple Developer - Activity Views](https://developer.apple.com/design/human-interface-guidelines/activity-views)  
**Last Updated:** December 2025  
**Note:** Curated summary from Apple's activity views guidelines

---

## Overview

> "An activity view — often called a share sheet — presents a range of tasks that people can perform in the current context."

Share sheets allow users to:

- Share content with others
- Perform actions on content
- Save to apps or services

---

## When to Use

✅ **Use share sheet for:**

- Sharing training logs with friends
- Exporting data
- Saving to other apps
- Copying content

❌ **Don't use for:**

- Primary app actions
- Navigation
- Settings

---

## Share Sheet for BJJ Progress

### What to Share

#### 1. **Training Summary**

```
🥋 BJJ Training - Dec 9, 2025
Type: GI
Duration: 90 min
Submissions: 3
Notes: Great session!
```

#### 2. **Stats Screenshot**

- Weekly/monthly stats
- Training streak
- Progress charts

#### 3. **Export Data**

- CSV export of all trainings
- PDF report

---

## Implementation

### React Native Share

```tsx
import Share from "react-native-share";

const shareTraining = async (log: TrainingLog) => {
  const message = `
🥋 BJJ Training - ${new Date(log.date).toLocaleDateString()}
Type: ${log.type}
Duration: ${log.duration} min
${log.notes ? `Notes: ${log.notes}` : ""}
  `.trim();

  await Share.open({
    title: "Share Training",
    message: message,
    subject: "My BJJ Training",
  });
};
```

### Share with Image

```tsx
import ViewShot from "react-native-view-shot";

const shareStats = async () => {
  // Capture stats screen
  const uri = await viewShotRef.current.capture();

  await Share.open({
    title: "Share Stats",
    message: "Check out my BJJ progress!",
    url: uri,
    type: "image/png",
  });
};
```

---

## Custom Actions

### Add to Share Sheet

```tsx
const shareOptions = {
  title: "Share Training",
  message: trainingText,
  social: Share.Social.WHATSAPP, // Specific app
  // Custom actions
  activityItemSources: [
    {
      placeholderItem: { type: "text", content: trainingText },
      item: {
        default: { type: "text", content: trainingText },
      },
      linkMetadata: {
        title: "BJJ Training Log",
      },
    },
  ],
};
```

---

## Implementation Checklist

### Phase 1

- [ ] Add share button to training cards
- [ ] Share training summary as text
- [ ] Test with Messages, WhatsApp

### Phase 2

- [ ] Share stats as image
- [ ] Export CSV
- [ ] Copy to clipboard

### Phase 3

- [ ] Custom share templates
- [ ] Share to Instagram Stories
- [ ] PDF export

---

## Resources

- **React Native Share:** https://github.com/react-native-share/react-native-share
- **ViewShot:** https://github.com/gre/react-native-view-shot

---

## Related Documents

- [iOS Design Guidelines](ios-design-guidelines.md)
- [Quick Actions Guidelines](quick-actions-guidelines.md)

---

**Priority:** Add sharing after core features. Great for viral growth!
