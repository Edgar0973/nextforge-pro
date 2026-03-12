# export-updated-files.ps1
# Dumps selected project files into a single timestamped text file.

$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outFile = Join-Path $projectRoot "updated-files-dump-$timestamp.txt"

$files = @(
  "lib\leadNotifications.ts",
  "lib\telnyx.ts",
  "lib\supabaseAdmin.ts",
  "lib\notifyLead.ts",
  "app\api\contact\route.ts",
  "app\api\quotes\route.ts",
  "app\api\billing\route.ts",
  "app\api\support\route.ts"
)

"NextForgePro file dump - $timestamp" | Out-File -FilePath $outFile -Encoding UTF8
"Project root: $projectRoot" | Out-File -FilePath $outFile -Encoding UTF8 -Append
"" | Out-File -FilePath $outFile -Encoding UTF8 -Append

foreach ($rel in $files) {
  $path = Join-Path $projectRoot $rel
  "================================================================================" | Out-File $outFile -Encoding UTF8 -Append
  "FILE: $rel" | Out-File $outFile -Encoding UTF8 -Append
  "FULLPATH: $path" | Out-File $outFile -Encoding UTF8 -Append
  "================================================================================" | Out-File $outFile -Encoding UTF8 -Append

  if (Test-Path $path) {
    Get-Content -LiteralPath $path -Raw -Encoding UTF8 | Out-File $outFile -Encoding UTF8 -Append
  } else {
    "!! MISSING FILE !!" | Out-File $outFile -Encoding UTF8 -Append
  }

  "" | Out-File $outFile -Encoding UTF8 -Append
}

Write-Host "Wrote dump to: $outFile"