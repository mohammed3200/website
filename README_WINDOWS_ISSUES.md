# Fixing EPERM Errors on Windows

## Problem
Next.js is showing `EPERM: operation not permitted` errors when trying to rename files in the `.next` folder. This is a common Windows issue.

## Solutions

### Solution 1: Add Windows Defender Exclusions (Recommended)
Run as Administrator:
```powershell
.\disable-defender.ps1
```

Or manually:
1. Open Windows Security
2. Go to Virus & threat protection
3. Click "Manage settings" under Virus & threat protection settings
4. Scroll to Exclusions and click "Add or remove exclusions"
5. Add these folders:
   - `C:\Users\iG\Documents\Next.JS\website\.next`
   - `C:\Users\iG\Documents\Next.JS\website\node_modules`

### Solution 2: Disable Real-time Protection Temporarily
1. Open Windows Security
2. Virus & threat protection → Manage settings
3. Temporarily turn off "Real-time protection"
4. Restart dev server

### Solution 3: Use WSL (Windows Subsystem for Linux)
If you have WSL installed:
```bash
# In WSL terminal
cd /mnt/c/Users/iG/Documents/Next.JS/website
bun run dev
```

### Solution 4: Ignore the Errors (If App Works)
The errors are non-fatal. If your app is working (you see `GET /ar 200`), you can ignore them. They're just warnings about file operations.

### Solution 5: Use Different Port
Sometimes using a different port helps:
```powershell
$env:PORT=3001; bun run dev
```

### Solution 6: Run as Administrator
1. Right-click PowerShell/Terminal
2. Select "Run as Administrator"
3. Navigate to project folder
4. Run `bun run dev`

## Current Status
✅ **Your server IS running!** 
- `GET /ar 200` - Homepage works
- `GET /api/auth/session 200` - Auth works

The EPERM errors are just warnings. Your app should be functional at `http://localhost:3000`.

## Quick Fix Script
```powershell
# Run this to clean and restart
taskkill /F /IM node.exe /T 2>$null
taskkill /F /IM bun.exe /T 2>$null
Start-Sleep -Seconds 2
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
bun run dev
```

