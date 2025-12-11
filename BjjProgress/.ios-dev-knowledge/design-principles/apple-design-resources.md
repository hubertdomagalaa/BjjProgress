# Apple Design Resources - Downloads & Tools

**Source:** [Apple Developer - Design Resources](https://developer.apple.com/design/resources/)  
**Last Updated:** December 2025

---

## Overview

Official Apple design resources including UI kits, templates, fonts, icons, and device bezels for creating iOS apps.

---

## iOS & iPadOS Resources

### UI Kits (iOS 26 / iPadOS 26)

| Tool       | Link                                                                                   | Updated      | Size |
| ---------- | -------------------------------------------------------------------------------------- | ------------ | ---- |
| **Figma**  | [Download](https://www.figma.com/community/file/1527721578857867021/ios-and-ipados-26) | Nov 7, 2025  | -    |
| **Sketch** | [Download](https://sketch.com/s/f63aa308-1f82-498c-8019-530f3b846db9)                  | Nov 21, 2025 | -    |

### App Icon Templates

| Tool                      | Link                                                                                                                  | Size     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- |
| **Sketch**                | [Download](https://sketch.com/s/0ee52d20-8daf-49ef-b335-14020af3b060)                                                 | -        |
| **Photoshop/Illustrator** | [Download](https://devimages-cdn.apple.com/design/resources/download/iOS-26-Icon-Templates-Photoshop-Illustrator.dmg) | 119.4 MB |
| **Figma**                 | [Download](https://www.figma.com/community/file/1514335373494164156/app-icon-template)                                | -        |

### Production Templates (iOS 18)

For final app icon production:

- **Sketch:** [Download](https://devimages-cdn.apple.com/design/resources/download/iOS-18-Production-Templates-Sketch.dmg) (3.8 MB)
- **Photoshop:** [Download](https://devimages-cdn.apple.com/design/resources/download/iOS-18-Production-Templates-Photoshop.dmg) (5.5 MB)
- **Figma:** [Download](https://www.figma.com/community/file/1387687009990313744/ios-18-and-ipados-18-app-icon-production-templates)

---

## Fonts

### San Francisco (SF) Family

| Font           | Purpose                  | Download                                                                             |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| **SF Pro**     | iOS, iPadOS, macOS, tvOS | [Download](https://devimages-cdn.apple.com/design/resources/download/SF-Pro.dmg)     |
| **SF Compact** | watchOS (small sizes)    | [Download](https://devimages-cdn.apple.com/design/resources/download/SF-Compact.dmg) |
| **SF Mono**    | Code/monospaced text     | [Download](https://devimages-cdn.apple.com/design/resources/download/SF-Mono.dmg)    |

### Other Fonts

- **New York:** Traditional reading face - [Download](https://devimages-cdn.apple.com/design/resources/download/NY.dmg)
- **SF Arabic:** Arabic system font - [Download](https://devimages-cdn.apple.com/design/resources/download/SF-Arabic.dmg)
- **SF Hebrew:** Hebrew with Niqqud support - [Download](https://devimages-cdn.apple.com/design/resources/download/SF-Hebrew.dmg)

---

## SF Symbols

**6,900+ symbols** designed to integrate with San Francisco font.

### Features

- ✅ 9 weights and 3 scales
- ✅ Automatically align with text
- ✅ Editable in vector tools
- ✅ Supports color, multicolor, hierarchical rendering
- ✅ Draw animations (SF Symbols 7)

### Downloads

- **SF Symbols 7:** [Download](https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-7.dmg) (483 MB) - Requires macOS Sonoma+
- **SF Symbols 6:** [Download](https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-6.dmg) (385.4 MB) - Requires macOS Ventura+

[Learn more about SF Symbols](https://developer.apple.com/sf-symbols/)

---

## Icon Composer

Create layered Liquid Glass icons for iPhone, iPad, Mac, and Apple Watch.

### Features

- Multi-layer icon format
- Dynamic lighting effects
- Appearance mode annotations
- Seamless Xcode integration
- Export flattened versions for marketing

**Download:** [Icon Composer 1.1](https://devimages-cdn.apple.com/design/resources/download/Icon-Composer-1.1.dmg) (15.5 MB)  
**Requires:** macOS Sequoia or later

[Learn more](https://developer.apple.com/icon-composer/)

---

## Product Bezels (Device Mockups)

Use these for marketing materials and App Store screenshots.

### iPhone

- **iPhone 17:** [Download](https://devimages-cdn.apple.com/design/resources/download/Bezel-iPhone-17.dmg) (265 MB)
- **iPhone 16:** [Download](https://devimages-cdn.apple.com/design/resources/download/Bezel-iPhone-16.dmg) (273 MB)

### iPad

- **iPad Pro M4:** [Download](https://devimages-cdn.apple.com/design/resources/download/Bezel-iPad-Pro-M4.dmg) (7 MB)
- **iPad Air M2:** [Download](https://devimages-cdn.apple.com/design/resources/download/Bezel-iPad-Air-M2.dmg) (12.3 MB)
- **iPad mini:** [Download](https://devimages-cdn.apple.com/design/resources/download/Bezel-iPad-mini.dmg) (4.1 MB)

### Apple Watch

- **Apple Watch Series 11:** [Download](https://devimages-cdn.apple.com/design/resources/download/Bezel-Apple-Watch-Series-11-2025.dmg) (358 MB)
- **Apple Watch Ultra 3:** [Download](https://devimages-cdn.apple.com/design/resources/download/Bezel-Apple-Watch-Ultra-3-2025.dmg) (329 MB)

### All Bezels

- **Sketch Library:** [Download](sketch://add-library?url=https%3A%2F%2Fdeveloper.apple.com%2Fdesign%2Fdownloads%2Fsketch-bezels.rss) (74.2 MB)

> **Note:** Review [Marketing Guidelines](https://developer.apple.com/app-store/marketing/guidelines/#section-products) when using bezels.

---

## Badges & Logos

Official badges for Apple technologies (Apple Pay, Health, Wallet, Music, etc.)

[View Apple Badges and Logos](https://developer.apple.com/softwarelicensing/)

---

## Practical Usage for BJJ Progress

### What You Need

1. ✅ **SF Pro Font** - Already using system default
2. ✅ **SF Symbols** - Replace Lucide icons with SF Symbols
3. ✅ **iPhone Bezels** - For App Store screenshots
4. ⚠️ **iPad Bezels** - For iPad screenshots (required if supporting iPad)

### Recommended Downloads

```bash
# Essential
1. SF Symbols 7 (for icons)
2. iPhone 17 Bezel (for screenshots)
3. iPad Pro M4 Bezel (for iPad screenshots)

# Optional
4. Icon Composer (for app icon)
5. Figma UI Kit (for design mockups)
```

### Using SF Symbols in React Native

```tsx
// Instead of Lucide icons:
import { Trash2 } from "lucide-react-native";

// Use SF Symbols (via react-native-sf-symbols):
import SFSymbol from "react-native-sfsymbols";

<SFSymbol
  name="trash"
  weight="semibold"
  scale="medium"
  color="#ef4444"
  size={20}
/>;
```

**Install:** `npm install react-native-sfsymbols`

---

## Quick Reference

| Resource      | Use Case         | Priority                |
| ------------- | ---------------- | ----------------------- |
| SF Symbols    | App icons/UI     | **High**                |
| SF Pro Font   | Typography       | **High** (automatic)    |
| iPhone Bezels | Screenshots      | **High**                |
| iPad Bezels   | iPad screenshots | **Medium**              |
| Figma UI Kit  | Design mockups   | Medium                  |
| Icon Composer | App icon         | Low (can use templates) |

---

## Related Documents

- [Apple Design Getting Started](apple-design-getting-started.md)
- [iOS Design Guidelines](ios-design-guidelines.md)
- [App Store Screenshots Guide](../app-store-guidelines/screenshots-guide.md) (coming soon)

---

**Next Steps:**

1. Download SF Symbols 7
2. Replace Lucide icons with SF Symbols
3. Create App Store screenshots using iPhone/iPad bezels
