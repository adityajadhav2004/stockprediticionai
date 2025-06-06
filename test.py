from Levenshtein import distance as levenshtein_distance

# ✅ Sample Stock List
STOCK_LIST = ["Apple", "AAPL", "Google", "GOOGL", "Tesla", "TSLA", "Amazon", "AMZN", "Meta", "META"]

# ✅ Normalization helper
def normalize_input(user_input):
    return user_input.strip().upper()

# ✅ Fuzzy matcher
def fuzzy_match(input_str, stock_list, threshold=2):
    input_str = normalize_input(input_str)
    closest_match = None
    min_distance = float('inf')

    for stock in stock_list:
        dist = levenshtein_distance(input_str, stock.upper())
        if dist < min_distance:
            min_distance = dist
            closest_match = stock

    if min_distance <= threshold:
        return closest_match
    return None

# ✅ Validator
def validate_stock_input(user_input):
    input_str = normalize_input(user_input)

    if input_str in [s.upper() for s in STOCK_LIST]:
        return {"valid": True, "match": input_str}

    suggestion = fuzzy_match(user_input, STOCK_LIST)
    if suggestion:
        return {"valid": True, "suggestion": suggestion}

    return {"valid": False}

# ✅ Test cases
test_inputs = [
    "Apple",         # valid
    "AAPL",          # valid
    "Gooogle",       # typo → Google
    "Amazn",         # typo → Amazon
    "weather",       # invalid
    "pm narendra modi", # invalid
    "",              # empty
    "    Tesla   ",  # with spaces
    "<script>",      # HTML injection
    "123456"         # numbers only
]

# ✅ Run tests
for inp in test_inputs:
    result = validate_stock_input(inp)
    print(f"Input: '{inp}' → Result: {result}")
