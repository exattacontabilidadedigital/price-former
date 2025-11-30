# Script to replace hardcoded dark mode colors with CSS variables

$replacements = @{
    'dark:bg-zinc-900 dark:border-zinc-800' = 'dark:bg-card dark:border-border'
    'dark:bg-zinc-900' = 'dark:bg-card'
    'dark:bg-zinc-800 dark:border-zinc-700 dark:text-white' = 'dark:bg-input dark:border-input dark:text-white'
    'dark:bg-zinc-800 dark:border-zinc-700' = 'dark:bg-input dark:border-input'
    'dark:bg-zinc-800/50' = 'dark:bg-muted/50'
    'dark:bg-zinc-800' = 'dark:bg-muted'
    'dark:border-zinc-800' = 'dark:border-border'
    'dark:border-zinc-700' = 'dark:border-input'
    'dark:hover:bg-zinc-800/50' = 'dark:hover:bg-muted/50'
    'dark:hover:bg-zinc-800' = 'dark:hover:bg-muted'
    'dark:focus:bg-zinc-800' = 'dark:focus:bg-muted'
}

$files = @(
    'src\app\page.tsx',
    'src\app\dashboard\page.tsx',
    'src\app\products\page.tsx',
    'src\app\costs\page.tsx'
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        $originalContent = $content
        
        # Apply replacements in order (most specific first)
        foreach ($pattern in $replacements.Keys | Sort-Object -Descending { $_.Length }) {
            $content = $content -replace [regex]::Escape($pattern), $replacements[$pattern]
        }
        
        if ($content -ne $originalContent) {
            Set-Content $fullPath -Value $content -NoNewline
            Write-Host "Updated: $file" -ForegroundColor Green
        } else {
            Write-Host "No changes: $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nDone!" -ForegroundColor Cyan
