param(
  [string]$Path = ".",
  [int]$Depth = 6
)

# Folders we don't want to see in the tree (too big / noisy)
$excludeDirs = @(
  'node_modules',
  '.git',
  '.next',
  '.turbo',
  '.vscode',
  '.idea'
)

function Show-Tree {
  param(
    [string]$BasePath,
    [int]$Level
  )

  if ($Level -gt $Depth) {
    return
  }

  # Get children, filter excluded dirs, sort with folders first
  $items = Get-ChildItem -LiteralPath $BasePath | Where-Object {
    if ($_.PSIsContainer) {
      -not ($excludeDirs -contains $_.Name)
    }
    else {
      $true
    }
  } | Sort-Object { -not $_.PSIsContainer }, Name

  foreach ($item in $items) {
    $indent = ' ' * ($Level * 2)
    $prefix = if ($item.PSIsContainer) { '+ ' } else { '- ' }

    Write-Output ("{0}{1}{2}" -f $indent, $prefix, $item.Name)

    if ($item.PSIsContainer) {
      Show-Tree -BasePath $item.FullName -Level ($Level + 1)
    }
  }
}

$resolved = Resolve-Path $Path
Write-Output "Project tree for: $resolved"
Show-Tree -BasePath $resolved -Level 0
