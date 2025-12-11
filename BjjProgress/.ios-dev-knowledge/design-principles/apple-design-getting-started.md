# Apple Design Principles - Getting Started

**Source:** [Apple Developer - Get Started with Design](https://developer.apple.com/design/get-started/)  
**Last Updated:** December 2025

---

## Overview

This document summarizes Apple's foundational design principles and resources for iOS app development. Following these principles helps create apps that feel native to Apple platforms and pass App Store review.

---

## Core Design Philosophy

> "Design is where everything starts. It's not just how people view your app, but also how they interact with it. Design drives people's experiences, impressions, and feelings."

### Key Principles

1. **Welcoming** - Create experiences that make users feel comfortable
2. **Empowering** - Give users control and confidence
3. **Gratifying** - Provide satisfying interactions and feedback

---

## Human Interface Guidelines (HIG)

The [HIG](https://developer.apple.com/design/human-interface-guidelines/) is your comprehensive resource from first sketch to final pixel.

### Essential Sections

| Section          | Purpose                                                 | Link                                                                                     |
| ---------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Platforms**    | Platform-specific guidance (iOS, iPadOS, macOS, etc.)   | [Learn more](https://developer.apple.com/design/human-interface-guidelines/platforms)    |
| **Foundations**  | Fundamental design elements (color, typography, layout) | [Learn more](https://developer.apple.com/design/human-interface-guidelines/foundations)  |
| **Patterns**     | Common actions, tasks, and experiences                  | [Learn more](https://developer.apple.com/design/human-interface-guidelines/patterns)     |
| **Components**   | System-defined UI components                            | [Learn more](https://developer.apple.com/design/human-interface-guidelines/components)   |
| **Inputs**       | Touch, keyboard, voice, and other input methods         | [Learn more](https://developer.apple.com/design/human-interface-guidelines/inputs)       |
| **Technologies** | Apple features and services integration                 | [Learn more](https://developer.apple.com/design/human-interface-guidelines/technologies) |

---

## Design Resources

### Apple Design Resources

Essential building blocks for Apple design:

- **Fonts** - San Francisco (SF) font family
- **Icons** - System icons and templates
- **Templates** - Figma, Sketch, Photoshop, Keynote
- **Product Bezels** - Device frames for mockups

[Download Resources](https://developer.apple.com/design/resources/)

### SF Symbols

- **6,000+ symbols** that integrate seamlessly with Apple platforms
- Automatically adapt to different sizes and weights
- Support for color, multicolor, and hierarchical rendering

---

## Prototyping Best Practices

### Why Prototype?

- Generate and test new ideas quickly
- Validate concepts before full development
- Get user feedback early

### Recommended WWDC Sessions

1. **[The qualities of great design](https://developer.apple.com/videos/play/wwdc2018/801/)** - Core design principles
2. **[Essential design principles](https://developer.apple.com/videos/play/wwdc2017/802/)** - Fundamental concepts
3. **[Prototyping: Fake it till you make it](https://developer.apple.com/videos/play/wwdc2014/223/)** - Prototyping process
4. **[60-second prototyping](https://developer.apple.com/videos/play/wwdc2017/818/)** - Quick iteration techniques
5. **[Design with SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10115/)** - Modern design workflow

---

## Community & Inspiration

### Resources

- **[Apple Design Awards](https://developer.apple.com/design/awards/)** - Award-winning apps showcase
- **[Design Articles](https://developer.apple.com/design/whats-new/)** - Latest design updates and stories
- **[WWDC Design Videos](https://developer.apple.com/videos/design)** - Full collection of design sessions
- **[Developer Events](https://developer.apple.com/events/)** - Workshops, labs, and appointments

### Key Insights

- **10 Questions with Design Evangelism** - Philosophy and simplification tips
- **Meet the Prototypers** - How Apple's team creates prototypes

---

## Practical Application for BJJ Progress App

### What We Applied

✅ **Native Components** - Used system fonts, icons, and UI patterns  
✅ **Platform-Specific Design** - iOS-specific interactions and gestures  
✅ **Accessibility** - Added `accessibilityLabel` and `accessibilityRole`  
✅ **Responsive Layout** - `adjustsFontSizeToFit` for iPad support

### What to Improve

- [ ] Add SF Symbols instead of Lucide icons
- [ ] Follow HIG spacing and padding guidelines more strictly
- [ ] Implement Apple's recommended navigation patterns
- [ ] Add haptic feedback for more interactions (already started)

---

## Quick Reference Checklist

Before submitting to App Store:

- [ ] Follows HIG for your platform (iOS/iPadOS)
- [ ] Uses system fonts (San Francisco)
- [ ] Implements native UI components where possible
- [ ] Supports all device sizes (iPhone, iPad)
- [ ] Text is readable and not truncated
- [ ] Navigation is intuitive and follows patterns
- [ ] Accessibility labels are present
- [ ] Design feels "at home" on Apple platforms

---

## Related Documents

- [App Store Guidelines](../app-store-guidelines/) - Submission requirements
- [Common Rejections](../common-rejections/) - Design-related rejection reasons
- [Technical Setup](../technical-setup/) - Implementation guides

---

**Next Steps:** Explore specific HIG sections relevant to your app type (e.g., navigation, data entry, charts for BJJ Progress).
