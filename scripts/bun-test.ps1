# script to run tests with Bun
# Usage: ./scripts/bun-test.ps1 [test-file]

param (
    [string]$TestFile = "tests/e2e/innovator-registration.test.tsx"
)

Write-Host "Running tests with Bun: $TestFile" -ForegroundColor Cyan
bun test $TestFile
