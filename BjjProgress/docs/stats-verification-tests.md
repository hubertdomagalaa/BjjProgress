# Stats Data Verification Test Plan

## Test Scenarios

### Scenario 1: Basic Data Aggregation

**Setup:**

- 3 GI trainings (90 min each)
- 2 NO-GI trainings (60 min each)
- Each training has 2 sparring sessions
- Each sparring: 2 given, 1 received

**Expected Results:**

```
Total Trainings: 5
Total Sparring Sessions: 10
Total Mat Time: 390 min (6h 30m)
Submissions Given: 20 (2 × 10)
Submissions Received: 10 (1 × 10)
Win Rate: 67% (20 ÷ 30)
```

---

### Scenario 2: No Sparring Sessions

**Setup:**

- 5 trainings
- 0 sparring sessions

**Expected Results:**

```
Total Trainings: 5
Total Sparring Sessions: 0
Submissions Given: 0
Submissions Received: 0
Win Rate: 0%
```

---

### Scenario 3: Perfect Win Record

**Setup:**

- 3 trainings
- 6 sparring sessions
- Each sparring: 3 given, 0 received

**Expected Results:**

```
Submissions Given: 18
Submissions Received: 0
Win Rate: 100%
```

---

### Scenario 4: Perfect Loss Record

**Setup:**

- 3 trainings
- 6 sparring sessions
- Each sparring: 0 given, 3 received

**Expected Results:**

```
Submissions Given: 0
Submissions Received: 18
Win Rate: 0%
```

---

### Scenario 5: Time Range Filtering

**Setup:**

- 10 trainings total
- 5 from this week
- 3 from last month
- 2 from last year

**Expected Results:**

- Week filter: 5 trainings
- Month filter: 8 trainings (5 + 3)
- Year filter: 10 trainings (all)

---

### Scenario 6: Training Type Filtering

**Setup:**

- 6 GI trainings
- 4 NO-GI trainings

**Expected Results:**

- ALL filter: 10 trainings
- GI filter: 6 trainings
- NO-GI filter: 4 trainings

---

## Manual Verification Steps

### Step 1: Check Submission Sources

```tsx
// In StatsScreen.tsx, verify this logic:
relevantSparring.forEach((sparring) => {
  totalSubsGiven += sparring.submission_given || 0;
  totalSubsReceived += sparring.submission_received || 0;
});
// Should NOT use log.submission_given
```

### Step 2: Verify Filter Accuracy

1. Add trainings with different dates
2. Switch time range (Week/Month/Year)
3. Check if counts update correctly
4. Verify chart data matches

### Step 3: Verify Win Rate Formula

```
Win Rate = (Submissions Given / Total Submissions) × 100
Total Submissions = Submissions Given + Submissions Received

Edge cases:
- If Total = 0, then Win Rate = 0%
- If Received = 0, then Win Rate = 100%
- If Given = 0, then Win Rate = 0%
```

### Step 4: Check Sparring Session Linking

1. Create a training
2. Add 3 sparring sessions to it
3. Check stats - should show 3 sparrings
4. Delete the training
5. Check stats - should show 0 sparrings

---

## Verification Checklist

### Data Integrity

- [ ] Submissions counted from sparring sessions (not training logs)
- [ ] Sparring sessions linked to correct training
- [ ] Filtered logs only count relevant sparrings
- [ ] Time filtering works correctly
- [ ] Training type filtering works correctly

### Display Accuracy

- [ ] Total trainings count is correct
- [ ] Total sparring sessions count is correct
- [ ] Mat time displays in hours and minutes
- [ ] Submissions given shows real data
- [ ] Submissions received shows real data
- [ ] Win rate calculation is accurate
- [ ] Average per training is correct

### Edge Cases

- [ ] Zero sparrings handled gracefully
- [ ] Zero trainings shows empty state
- [ ] Perfect win record (100%) displays correctly
- [ ] Perfect loss record (0%) displays correctly
- [ ] Division by zero prevented

---

## Known Good State

After implementing fixes, a "known good" test is:

1. **Add 1 training** with 2 sparring sessions
2. **First sparring**: 3 given, 1 received
3. **Second sparring**: 2 given, 0 received

**Expected Stats:**

- Trainings: 1
- Sparrings: 2
- Given: 5
- Received: 1
- Win Rate: 83% (5 ÷ 6)

If these match, stats calculation is working correctly!
