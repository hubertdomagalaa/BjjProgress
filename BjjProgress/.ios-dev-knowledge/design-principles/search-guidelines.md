# Search - iOS Design Guidelines

**Source:** [Apple Developer - Searching](https://developer.apple.com/design/human-interface-guidelines/searching)  
**Last Updated:** December 2025  
**Note:** Curated summary from Apple's search guidelines

---

## Overview

> "People use various search techniques to find content on their device, within an app, and within a document or file."

Search helps users quickly find specific content without browsing.

---

## Search Bar Placement

### Navigation Bar (Recommended)

- Appears below navigation bar
- Scrolls with content
- Most common placement

### Toolbar

- Fixed at bottom
- Always visible
- Good for search-focused apps

### Inline

- Embedded in content
- Contextual search
- Less common

---

## Search Best Practices

### Do's ✅

- Show search bar prominently
- Provide instant results as user types
- Show recent searches
- Offer search suggestions
- Clear search with X button
- Support voice search (Siri)
- Show "No Results" state clearly

### Don'ts ❌

- Hide search behind multiple taps
- Require exact matches only
- Show empty results without explanation
- Ignore typos and variations
- Make search too slow

---

## Search for BJJ Progress

### What to Search

1. **Training logs** by date, type, notes
2. **Techniques** (submissions, sweeps, positions)
3. **Training partners** by name
4. **Locations** (gyms, tournaments)

### Search Implementation

```tsx
// HomeScreen.tsx - Add search bar
import { SearchBar } from "react-native-elements";

const [searchQuery, setSearchQuery] = useState("");

<SearchBar
  placeholder="Search trainings..."
  onChangeText={setSearchQuery}
  value={searchQuery}
  platform="ios"
  lightTheme
  containerStyle={{ backgroundColor: "transparent" }}
  inputContainerStyle={{ backgroundColor: "#1e293b" }}
/>;

// Filter logs
const filteredLogs = logs.filter(
  (log) =>
    log.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(log.date).toLocaleDateString().includes(searchQuery)
);
```

---

## Search Scopes (Filters)

### Example for BJJ Progress

```
[All] [GI] [NO-GI] [Competition]
```

Implementation:

```tsx
<View style={{ flexDirection: "row", padding: 10 }}>
  <TouchableOpacity onPress={() => setScope("all")}>
    <Text>All</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setScope("gi")}>
    <Text>GI</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setScope("nogi")}>
    <Text>NO-GI</Text>
  </TouchableOpacity>
</View>
```

---

## Search Suggestions

### Recent Searches

```tsx
const [recentSearches, setRecentSearches] = useState<string[]>([]);

// Save search
const handleSearch = (query: string) => {
  setRecentSearches([query, ...recentSearches.slice(0, 4)]);
};

// Show suggestions
{
  recentSearches.map((search) => (
    <TouchableOpacity key={search} onPress={() => setSearchQuery(search)}>
      <Text>{search}</Text>
    </TouchableOpacity>
  ));
}
```

---

## Empty States

### No Results

```tsx
{
  filteredLogs.length === 0 && searchQuery && (
    <View style={{ alignItems: "center", padding: 40 }}>
      <Text>No trainings found for "{searchQuery}"</Text>
      <Text>Try different keywords</Text>
    </View>
  );
}
```

---

## Advanced Search Features

### Date Range Filter

```tsx
<DateRangePicker
  startDate={startDate}
  endDate={endDate}
  onChange={(start, end) => {
    setStartDate(start);
    setEndDate(end);
  }}
/>
```

### Multi-field Search

```tsx
const searchLogs = (query: string) => {
  return logs.filter((log) => {
    const searchableFields = [
      log.notes,
      log.type,
      log.tournament_name,
      log.location,
      new Date(log.date).toLocaleDateString(),
    ]
      .join(" ")
      .toLowerCase();

    return searchableFields.includes(query.toLowerCase());
  });
};
```

---

## Implementation Checklist

### Phase 1 (Essential)

- [ ] Add search bar to HomeScreen
- [ ] Filter by notes and type
- [ ] Show "No Results" state
- [ ] Clear button

### Phase 2 (Enhanced)

- [ ] Recent searches
- [ ] Search scopes (GI/NO-GI/COMP)
- [ ] Date range filter
- [ ] Search by technique

### Phase 3 (Advanced)

- [ ] Voice search
- [ ] Search suggestions
- [ ] Fuzzy matching
- [ ] Search analytics

---

## Resources

- **UISearchController:** https://developer.apple.com/documentation/uikit/uisearchcontroller
- **React Native Elements SearchBar:** https://reactnativeelements.com/docs/searchbar

---

## Related Documents

- [iOS Design Guidelines](ios-design-guidelines.md)
- [Quick Actions Guidelines](quick-actions-guidelines.md)

---

**Priority:** Add search after core app is stable and you have 100+ trainings logged. Not critical for launch.
