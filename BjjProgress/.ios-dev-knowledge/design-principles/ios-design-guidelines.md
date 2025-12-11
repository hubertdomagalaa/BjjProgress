# Designing for iOS - Human Interface Guidelines

**Source:** [Apple Developer - Designing for iOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-ios)  
**Last Updated:** December 2025  
**Note:** This is a curated summary. For full details, visit the official Apple documentation.

---

## Overview

> "People depend on their iPhone to help them stay connected, play games, view media, accomplish tasks, and track personal data in any location and while on the go."

iOS apps should feel intuitive, responsive, and native to the platform.

---

## iOS Design Themes

### 1. **Clarity**

- Text is legible at every size
- Icons are precise and lucid
- Adornments are subtle and appropriate
- Functionality is the focus

### 2. **Deference**

- Fluid motion and crisp interface help people understand and interact with content
- Content typically fills the entire screen
- Translucency and blurring often hint at more content

### 3. **Depth**

- Visual layers and realistic motion convey hierarchy
- Touch and discoverability heighten delight
- Transitions provide context

---

## Key iOS Interface Essentials

### Navigation

- **Hierarchical Navigation** - One choice per screen until destination (Settings app)
- **Flat Navigation** - Switch between multiple content categories (Music app)
- **Content-Driven Navigation** - Move freely through content (Games, books)

### Gestures

- **Tap** - Select a control or item
- **Drag** - Scroll or pan
- **Swipe** - Reveal actions, navigate, or delete
- **Pinch** - Zoom in or out
- **Long Press** - Reveal additional options

### Typography

- **San Francisco (SF)** - System font optimized for legibility
- **Dynamic Type** - Users can adjust text size
- **Weight Hierarchy** - Use font weights to establish importance

---

## iOS-Specific Patterns

### Safe Area

- Respect the safe area on all devices
- Account for notch, Dynamic Island, and home indicator
- Don't place critical content in unsafe zones

### Navigation Bars

- Large titles for top-level screens
- Standard titles for detail screens
- Use system buttons (Back, Done, Edit)

### Tab Bars

- 3-5 tabs maximum
- Use icons + labels
- Highlight selected tab
- Don't hide tab bar during navigation

### Modals & Sheets

- Use for focused tasks
- Provide clear dismissal (X button, swipe down)
- Don't nest modals

### Lists

- Use standard list styles (Inset, Grouped, Plain)
- Swipe actions for common tasks
- Pull to refresh for dynamic content

---

## iPad Considerations

### Layout

- **Multitasking** - Support Split View and Slide Over
- **Orientation** - Adapt to portrait and landscape
- **Larger Canvas** - Use space wisely, don't just scale up

### Text & Spacing

- Increase padding for larger screens
- Use `adjustsFontSizeToFit` to prevent truncation
- Consider multi-column layouts

### Interactions

- Support keyboard shortcuts
- Enable pointer interactions
- Optimize for Apple Pencil where relevant

---

## Common iOS Patterns for BJJ Progress App

### Training Log List

✅ **Use:** `UITableView` or `FlatList` with swipe actions  
✅ **Pattern:** Pull to refresh, swipe to delete  
✅ **Navigation:** Hierarchical (List → Detail → Edit)

### Stats Screen

✅ **Use:** Charts with clear labels  
✅ **Pattern:** Segmented control for time periods  
✅ **Avoid:** Overcrowding data on small screens

### Add/Edit Forms

✅ **Use:** Grouped lists for form fields  
✅ **Pattern:** Keyboard toolbar with Done button  
✅ **Navigation:** Modal presentation with Cancel/Save

### Settings

✅ **Use:** Grouped list style  
✅ **Pattern:** Standard iOS settings layout  
✅ **Include:** Version number, support links

---

## iOS App Store Requirements

### Essential Features

- [ ] Support all iPhone screen sizes (SE to Pro Max)
- [ ] Support iPad (if `supportsTablet: true`)
- [ ] Handle both orientations (or lock to portrait)
- [ ] Respect safe areas
- [ ] Use Dynamic Type
- [ ] Provide accessibility labels

### Performance

- [ ] Launch quickly (< 2 seconds)
- [ ] Respond to touches immediately
- [ ] Handle background/foreground transitions
- [ ] Manage memory efficiently

### Visual Polish

- [ ] No truncated text
- [ ] Consistent spacing and alignment
- [ ] Smooth animations (60fps)
- [ ] Proper loading states

---

## Accessibility (Required for App Store)

### VoiceOver

```tsx
<TouchableOpacity
  accessibilityLabel="Delete training log"
  accessibilityRole="button"
  accessibilityHint="Double tap to delete this training session"
>
```

### Dynamic Type

```tsx
<Text adjustsFontSizeToFit numberOfLines={2}>
  Training Log Title
</Text>
```

### Color Contrast

- Text: 4.5:1 minimum ratio
- Large text: 3:1 minimum ratio
- Use system colors for automatic dark mode

---

## iOS vs Android Differences

| Feature        | iOS                    | Android                |
| -------------- | ---------------------- | ---------------------- |
| Navigation     | Back button in nav bar | System back button     |
| Primary Action | Top-right (Save, Done) | Bottom-right FAB       |
| Modals         | Swipe down to dismiss  | Back button to dismiss |
| Icons          | SF Symbols             | Material Icons         |
| Typography     | San Francisco          | Roboto                 |

---

## Practical Checklist for BJJ Progress

### Before Submission

- [x] Uses San Francisco font (system default)
- [x] Respects safe areas
- [x] Supports all iPhone sizes
- [x] Supports iPad (added `adjustsFontSizeToFit`)
- [x] Accessibility labels added
- [x] No truncated text on iPad
- [ ] Test on iPhone SE (smallest screen)
- [ ] Test on iPad Pro (largest screen)
- [ ] Test with Dynamic Type (largest size)
- [ ] Test in dark mode

### Improvements for Next Version

- [ ] Replace Lucide icons with SF Symbols
- [ ] Add keyboard shortcuts for iPad
- [ ] Implement standard iOS swipe gestures
- [ ] Add haptic feedback to more actions
- [ ] Support landscape orientation on iPad

---

## Resources

- **Official HIG:** https://developer.apple.com/design/human-interface-guidelines/
- **SF Symbols:** https://developer.apple.com/sf-symbols/
- **Design Resources:** https://developer.apple.com/design/resources/
- **WWDC Videos:** https://developer.apple.com/videos/design

---

## Related Documents

- [Apple Design Getting Started](apple-design-getting-started.md)
- [App Store Guidelines](../app-store-guidelines/)
- [Common Rejections - iPad Layout](../common-rejections/ipad-layout-issues.md)

---

**Next:** Review App Store Review Guidelines to understand submission requirements.
