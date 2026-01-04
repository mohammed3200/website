# Fix Next.js Permission Issues on Windows
# Run this script as Administrator if needed

Write-Host "Cleaning Next.js build artifacts..." -ForegroundColor Yellow

# Stop all Node.js and Bun processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Cyan
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name bun -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Remove .next folder with retry logic
if (Test-Path ".next") {
    Write-Host "Removing .next folder..." -ForegroundColor Cyan
    $maxRetries = 5
    $retryCount = 0
    
    while ($retryCount -lt $maxRetries) {
        try {
            Remove-Item -Recurse -Force .next -ErrorAction Stop
            Write-Host "Success: .next folder removed successfully" -ForegroundColor Green
            break
        }
        catch {
            $retryCount++
            Write-Host "Retry $retryCount/$maxRetries - Waiting 2 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
            
            # Try to unlock files
            Get-Process | Where-Object { $_.Path -like "*$PWD*" } | Stop-Process -Force -ErrorAction SilentlyContinue
        }
    }
    
    if ($retryCount -eq $maxRetries) {
        Write-Host "Warning: Could not remove .next folder. Please close all editors and try again." -ForegroundColor Red
        Write-Host "Or manually delete the .next folder and restart." -ForegroundColor Yellow
    }
}

# Remove node_modules/.cache if exists
if (Test-Path "node_modules/.cache") {
    Write-Host "Removing node_modules cache..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
}

# Clear npm/bun cache
Write-Host "Clearing package manager cache..." -ForegroundColor Cyan
if (Get-Command bun -ErrorAction SilentlyContinue) {
    bun pm cache rm 2>$null
}

Write-Host ""
Write-Host "Cleanup complete! You can now run 'bun run dev'" -ForegroundColor Green

