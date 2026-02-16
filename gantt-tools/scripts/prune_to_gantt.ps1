param(
  [switch]$Force
)

$root = Get-Location
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $root "workspace_backup_$timestamp"

Write-Host "Создаю резервную копию в: $backupDir"
New-Item -ItemType Directory -Path $backupDir | Out-Null

# Копируем всё в резервную папку (скрытые файлы включены)
Get-ChildItem -Force | ForEach-Object {
  if ($_.Name -ne '.' -and $_.Name -ne '..') {
    Copy-Item -Path $_.FullName -Destination $backupDir -Recurse -Force
  }
}

Write-Host "Резервная копия создана."

if (-not $Force) {
  $resp = Read-Host "Удалить всё кроме 'Диаграмма Ганта.xlsx' и папки 'gantt-tools'? введите 'yes' для продолжения"
  if ($resp -ne 'yes') { Write-Host 'Отмена.'; exit 0 }
}

$keep = @('Диаграмма Ганта.xlsx','gantt-tools','.git','.github',"workspace_backup_$timestamp")

Get-ChildItem -Force | ForEach-Object {
  if ($keep -notcontains $_.Name) {
    Write-Host "Удаляю: $($_.FullName)"
    try { Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction Stop } catch { Write-Host "Ошибка удаления: $($_.Exception.Message)" }
  } else {
    Write-Host "Оставляю: $($_.Name)"
  }
}

Write-Host "Готово. Проверьте резервную папку и текущую структуру."
