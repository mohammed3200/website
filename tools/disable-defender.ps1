# Disable Windows Defender for Project Folder
# Run this script as Administrator

$projectPath = "C:\Users\iG\Documents\Next.JS\website"
$exclusions = @(
    "$projectPath\.next",
    "$projectPath\node_modules",
    "$projectPath\*.js",
    "$projectPath\*.ts"
)

Write-Host "Adding Windows Defender exclusions..." -ForegroundColor Yellow

foreach ($exclusion in $exclusions) {
    try {
        Add-MpPreference -ExclusionPath $exclusion -ErrorAction SilentlyContinue
        Write-Host "Added exclusion: $exclusion" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to add exclusion: $exclusion" -ForegroundColor Red
        Write-Host "You may need to run this as Administrator" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done! Windows Defender exclusions added." -ForegroundColor Green
Write-Host "You may need to restart your computer for changes to take effect." -ForegroundColor Yellow

