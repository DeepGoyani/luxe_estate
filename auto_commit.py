import os
import subprocess
import time

def get_modified_files():
    cmd = "git status -s"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    files = []
    for line in result.stdout.splitlines():
        if len(line) > 3:
            # Extract filename which starts at index 3
            filename = line[3:].strip()
            # Remove quotes if git added them
            if filename.startswith('"') and filename.endswith('"'):
                filename = filename[1:-1]
            files.append(filename)
    # Remove duplicates but keep order
    return list(dict.fromkeys(files))

def main():
    files = get_modified_files()
    if not files:
        print("No files discovered to commit.")
        return

    print(f"Found {len(files)} file(s) to commit.")
    
    for filename in files:
        print(f"\n[+] Staging: {filename}")
        subprocess.run(["git", "add", filename])
        
        # We try to use a clean commit message based on the filename
        base_name = os.path.basename(filename)
        commit_message = f"Update {base_name}"
        
        print(f"[*] Committing: {commit_message}")
        subprocess.run(["git", "commit", "-m", commit_message])
        
        print("[!] Waiting 3 seconds...")
        time.sleep(3)
        
    print("\n[>] Pushing to GitHub...")
    subprocess.run(["git", "push"])
    print("[v] Done!")

if __name__ == "__main__":
    main()
