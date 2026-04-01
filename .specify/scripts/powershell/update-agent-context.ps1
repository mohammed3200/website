# update-agent-context.ps1
#
# Updates the agent-specific context file (e.g., CLAUDE.md) while preserving
# custom manual additions between markers.

param(
    [Parameter(Mandatory=$true)]
    [string]$AgentType
)

$ErrorActionPreference = 'Stop'

# Define filename based on agent type
$contextFile = if ($AgentType -eq "claude") { "CLAUDE.md" } else { "$AgentType-context.md" }

# Markers for custom context
$beginMarker = "<!-- BEGIN CUSTOM CONTEXT -->"
$endMarker = "<!-- END CUSTOM CONTEXT -->"

# Locate repo root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = try { git rev-parse --show-toplevel 2>$null } catch { $null }
if (-not $repoRoot -or -not (Test-Path (Join-Path $repoRoot '.specify'))) {
    $repoRoot = $scriptDir
    $fsRoot = [System.IO.Path]::GetPathRoot($repoRoot)
    while ($repoRoot -and $repoRoot -ne $fsRoot -and -not (Test-Path (Join-Path $repoRoot '.specify'))) {
        $repoRoot = Split-Path -Parent $repoRoot
    }
}
if (-not $repoRoot -or -not (Test-Path (Join-Path $repoRoot '.specify'))) {
    throw "Failed to locate repository root (missing .specify directory)."
}

$targetPath = Join-Path $repoRoot $contextFile
$customContext = ""

# Read existing file to extract custom context
if (Test-Path $targetPath) {
    $content = Get-Content $targetPath -Raw
    $startIndex = $content.IndexOf($beginMarker)
    $endIndex = $content.IndexOf($endMarker)

    if ($startIndex -ge 0 -and $endIndex -gt $startIndex) {
        $customContext = $content.Substring($startIndex + $beginMarker.Length, $endIndex - ($startIndex + $beginMarker.Length)).Trim()
        Write-Information "Preserving custom context from markers."
    }
}

# Generate base content from template (or default)
$templatePath = Join-Path $repoRoot ".specify/templates/agent-context-template.md"
$newContent = if (Test-Path $templatePath) {
    Get-Content $templatePath -Raw
} else {
    "# Agent Context (Auto-generated)`n`n[CUSTOM_CONTEXT_PLACEHOLDER]"
}

# Wrap custom context in markers and re-insert
$markedCustom = @"
$beginMarker
$customContext
$endMarker
"@

if ($newContent.Contains("[CUSTOM_CONTEXT_PLACEHOLDER]")) {
    $newContent = $newContent.Replace("[CUSTOM_CONTEXT_PLACEHOLDER]", $markedCustom)
} else {
    $newContent += "`n`n## Custom Context`n$markedCustom"
}

# Write out the updated context file
Set-Content -Path $targetPath -Value $newContent -Encoding utf8
Write-Output "Updated $contextFile with marker preservation."
