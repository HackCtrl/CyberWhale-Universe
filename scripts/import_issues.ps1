Param(
    [string]$CsvPath = "docs/issues_import.csv"
)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "gh (GitHub CLI) is not installed. Install it and run this script again."
    exit 2
}

if (-not (Test-Path $CsvPath)) {
    Write-Error "CSV file not found: $CsvPath"
    exit 3
}

# Try to detect repo from git remote
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0 -or -not $remote) {
    Write-Host "Не удалось определить remote origin. Укажите репозиторий в формате owner/repo:"
    $repo = Read-Host "owner/repo"
} else {
    # remote can be git@github.com:owner/repo.git or https://github.com/owner/repo.git
    if ($remote -match ":(?<owner>[^/]+)/(?<repo>.+?)(\.git)?$") {
        $owner = $Matches.owner
        $r = $Matches.repo
    } elseif ($remote -match "github.com/(?<owner>[^/]+)/(?<repo>.+?)(\.git)?$") {
        $owner = $Matches.owner
        $r = $Matches.repo
    }
    if ($owner -and $r) { $repo = "$owner/$r" } else {
        Write-Host "Не удалось распарсить remote URL: $remote"
        $repo = Read-Host "Введите owner/repo"
    }
}

Write-Host "Using repo: $repo"

$rows = Import-Csv -Path $CsvPath -Encoding UTF8

foreach ($row in $rows) {
    $title = $row.title
    $body = $row.body -replace "`r`n", "`n"
    $labels = $null
    if ($row.labels -and $row.labels.Trim() -ne '') {
        $labels = $row.labels -split "," | ForEach-Object { $_.Trim() }
    }
    $cmd = "gh issue create --repo $repo --title `"$title`" --body `"$body`""
    if ($labels) {
        $lab = $labels -join ","
        $cmd += " --label `"$lab`""
    }
    Write-Host "Creating issue: $title"
    iex $cmd
}

Write-Host "Import finished."
