import os

def parse_env(file_path):
    if not os.path.exists(file_path):
        return {}
    vars = {}
    with open(file_path, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, _ = line.split('=', 1)
                vars[key.strip()] = True
    return vars

example_vars = parse_env('.env.example')
local_vars = parse_env('.env')

missing = [v for v in example_vars if v not in local_vars]

if missing:
    print("### Missing / Inactive Variables in .env (Found in .env.example) ###")
    for m in missing:
        print(f"- {m}")
else:
    print("All variables from .env.example are present in .env")
