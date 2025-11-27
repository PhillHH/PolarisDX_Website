import json
import os

langs = ['pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']
src_file = 'src/locales/en/translation.json'

# Load Source (English)
with open(src_file, 'r') as f:
    en_data = json.load(f)

for lang in langs:
    target_file = f'src/locales/{lang}/translation.json'

    # Load existing if present (to keep nav)
    existing_data = {}
    if os.path.exists(target_file):
        try:
            with open(target_file, 'r') as f:
                existing_data = json.load(f)
        except:
            print(f"Error reading {target_file}, starting fresh.")
            existing_data = {}

    # Function to recursively merge (EN is fallback, Existing is priority)
    # Actually, we want to fill MISSING keys in Existing with EN values.
    # So we copy EN, then update with Existing.

    # Deep merge helper? No, we can just use a recursive function or assume depth.
    # Simple dictionary update isn't enough for nested 'products', 'articles'.

    def deep_merge(source, destination):
        for key, value in source.items():
            if isinstance(value, dict):
                # get node or create one
                node = destination.setdefault(key, {})
                deep_merge(value, node)
            else:
                # If destination doesn't have it, set it
                if key not in destination:
                    destination[key] = value
                # If destination has it, keep it (Preserve existing translations)

    # Start with a copy of EN (as the base structure)
    # But wait, if I modify the copy, I might overwrite existing keys if I'm not careful.
    # Better: Start with empty, fill with EN, then overwrite with Existing.
    # No, start with Existing, fill missing from EN.

    final_data = {}

    # 1. Fill with EN (Recursively)
    import copy
    final_data = copy.deepcopy(en_data)

    # 2. Overlay Existing (Recursively)
    # We need a function that overwrites final_data with existing_data values
    def deep_update(target, updates):
        for key, value in updates.items():
            if isinstance(value, dict):
                target_node = target.setdefault(key, {})
                deep_update(target_node, value)
            else:
                target[key] = value

    deep_update(final_data, existing_data)

    # Ensure directory exists
    os.makedirs(os.path.dirname(target_file), exist_ok=True)

    with open(target_file, 'w') as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)

    print(f"Processed {lang}")
