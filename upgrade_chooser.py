def choose_upgrade(preferred, blacklisted, options):
    """
    Choose which upgrade option to take based on a decision hierarchy.
    
    Args:
        preferred: set of strings (preferred skills)
        blacklisted: set of strings (blacklisted skills)
        options: tuple of 3 pairs (skill, percentage) for options A, B, C
    
    Returns:
        str: "A", "B", "C", or "D" (for money)
    """
    
    # Map options to letters
    option_letters = ["A", "B", "C"]
    
    # Filter out blacklisted options
    valid_options = []
    for i, (skill, percentage) in enumerate(options):
        if skill not in blacklisted:
            valid_options.append((option_letters[i], skill, percentage))
    
    # If all options are blacklisted, return D
    if not valid_options:
        return "D"
    
    # Step 1: Look for preferred skills among valid options
    preferred_options = [opt for opt in valid_options if opt[1] in preferred]
    if preferred_options:
        # Choose the one with highest percentage
        return max(preferred_options, key=lambda x: x[2])[0]
    
    # Step 2: No preferred options, so choose neutral (valid but not preferred) with highest percentage
    return max(valid_options, key=lambda x: x[2])[0]


# Test with the provided example
if __name__ == "__main__":
    preferred = {"attack", "defense"}
    blacklisted = {"luck"}
    options = (("luck", 25), ("speed", 20), ("defense", 15))
    
    result = choose_upgrade(preferred, blacklisted, options)
    print(f"Result: {result}")  # Expected: C
    
    # Additional test cases
    print("\n--- Additional Test Cases ---")
    
    # Test case 2: All blacklisted
    print("\nTest 2: All blacklisted")
    preferred2 = {"attack"}
    blacklisted2 = {"luck", "speed", "defense"}
    options2 = (("luck", 25), ("speed", 20), ("defense", 15))
    result2 = choose_upgrade(preferred2, blacklisted2, options2)
    print(f"Result: {result2}")  # Expected: D
    
    # Test case 3: Multiple preferred with different percentages
    print("\nTest 3: Multiple preferred with different percentages")
    preferred3 = {"attack", "defense"}
    blacklisted3 = {"luck"}
    options3 = (("attack", 25), ("luck", 100), ("defense", 50))
    result3 = choose_upgrade(preferred3, blacklisted3, options3)
    print(f"Result: {result3}")  # Expected: C (defense with 50)
    
    # Test case 4: Neutral options only
    print("\nTest 4: Neutral options only")
    preferred4 = {"fireball"}
    blacklisted4 = {"curse"}
    options4 = (("speed", 30), ("strength", 40), ("agility", 25))
    result4 = choose_upgrade(preferred4, blacklisted4, options4)
    print(f"Result: {result4}")  # Expected: B (strength with 40)
    
    # Test case 5: Tie between same percentage
    print("\nTest 5: Tie between same percentage (preferred)")
    preferred5 = {"attack", "defense"}
    blacklisted5 = set()
    options5 = (("attack", 50), ("defense", 50), ("speed", 30))
    result5 = choose_upgrade(preferred5, blacklisted5, options5)
    print(f"Result: {result5}")  # Expected: A or B (both have 50, function returns first)
