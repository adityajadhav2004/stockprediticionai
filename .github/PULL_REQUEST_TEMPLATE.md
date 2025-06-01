## Fix: Search Bar Case-Sensitivity Issue

### Problem
When searching for stock names in all caps (e.g., "GOOGLE"), the system goes blank and the API does not work.

### Solution
This PR documents the issue and proposes a fix so that the search bar works regardless of input case.

---

- [ ] Bug reproducible: Search for "GOOGLE" (all caps) causes blank state
- [ ] Fix implemented: Search should work for any case (e.g., "google", "GOOGLE", "Google")

---

Closes #<issue-number-if-any>

---

**Checklist:**
- [ ] Tested locally
- [ ] No sensitive data exposed
- [ ] Ready for review

/cc @adityajadhav2004
