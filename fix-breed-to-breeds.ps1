# PowerShell script to replace all 'breed' references with 'breeds'
# Compatible with PowerShell 5.1

Write-Host "Starting breed -> breeds replacement..." -ForegroundColor Cyan

# File to fix - use proper path
$file = "app\dogs\[id]\edit\page.tsx"

Write-Host "Processing: $file" -ForegroundColor Yellow

# Read the file content (PowerShell 5.1 compatible)
$content = [System.IO.File]::ReadAllText($file)

# Perform replacements in order (most specific to least specific)
Write-Host "  - Replacing interface Dog breed property..." -ForegroundColor Gray
$content = $content -replace 'breed\?\s*:\s*string\[\]', 'breeds?: string[]'

Write-Host "  - Replacing function parameter breed..." -ForegroundColor Gray
$content = $content -replace 'name\?\s*:\s*string;\s*breed\?\s*:\s*string\[\];', 'name?: string;`n  breeds?: string[];'

Write-Host "  - Replacing GraphQL mutation field 'breed'..." -ForegroundColor Gray
$content = $content -replace '(\s+)breed(\s+)', '$1breeds$2'

Write-Host "  - Replacing dogData.breed references..." -ForegroundColor Gray
$content = $content -replace '(dogData\.)breed(\s)', '$1breeds$2'
$content = $content -replace '(dogData\.)breed(\))', '$1breeds$2'
$content = $content -replace '(dogData\.)breed(\])', '$1breeds$2'

Write-Host "  - Replacing { breed: } in objects..." -ForegroundColor Gray
$content = $content -replace '\{\s*breed:', '{ breeds:'

Write-Host "  - Replacing , breed, in destructuring..." -ForegroundColor Gray
$content = $content -replace ',\s*breed\s*,', ', breeds,'

# Write back to file (PowerShell 5.1 compatible)
[System.IO.File]::WriteAllText($file, $content)

Write-Host "✅ Completed: $file" -ForegroundColor Green

# Now check add-dog page
Write-Host "`nChecking add-dog page for any remaining issues..." -ForegroundColor Yellow
$addDogFile = "app\add-dog\page.tsx"
$addDogContent = [System.IO.File]::ReadAllText($addDogFile)

# Check if there are any standalone 'breed' property references that should be 'breeds'
if ($addDogContent -match '\s+breed\?\s*:\s*string\[\]') {
    Write-Host "  - Found breed property in add-dog page, fixing..." -ForegroundColor Gray
    $addDogContent = $addDogContent -replace '(\s+)breed(\?\s*:\s*string\[\])', '$1breeds$2'
    [System.IO.File]::WriteAllText($addDogFile, $addDogContent)
    Write-Host "✅ Fixed add-dog page" -ForegroundColor Green
} else {
    Write-Host "✅ add-dog page looks good" -ForegroundColor Green
}

# Check recent-activity page
Write-Host "`nChecking recent-activity page..." -ForegroundColor Yellow
$recentActivityFile = "app\recent-activity\page.tsx"
if (Test-Path $recentActivityFile) {
    $recentContent = [System.IO.File]::ReadAllText($recentActivityFile)
    if ($recentContent -match '\s+breed\?\s*:\s*string\[\]') {
        Write-Host "  - Found breed property in recent-activity page, fixing..." -ForegroundColor Gray
        $recentContent = $recentContent -replace '(\s+)breed(\?\s*:\s*string\[\])', '$1breeds$2'
        [System.IO.File]::WriteAllText($recentActivityFile, $recentContent)
        Write-Host "✅ Fixed recent-activity page" -ForegroundColor Green
    } else {
        Write-Host "✅ recent-activity page looks good" -ForegroundColor Green
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All replacements completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nSummary of changes:" -ForegroundColor Yellow
Write-Host "  - breed?: string[]  →  breeds?: string[]" -ForegroundColor White
Write-Host "  - dogData.breed     →  dogData.breeds" -ForegroundColor White
Write-Host "  - { breed: }        →  { breeds: }" -ForegroundColor White
Write-Host "  - GraphQL 'breed'   →  GraphQL 'breeds'" -ForegroundColor White
Write-Host "`nPlease verify the changes and test your app!" -ForegroundColor Cyan
