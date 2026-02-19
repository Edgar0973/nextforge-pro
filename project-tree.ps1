[CmdletBinding()]
param(
    [string]$Path = ".",
    [int]$MaxDepth = 6,
    [string[]]$ExcludeDirs = @("node_modules", ".git", ".next", ".turbo", ".vercel", ".vscode", "dist", "build"),
    [string[]]$ExcludeFiles = @("package-lock.json", "yarn.lock", "pnpm-lock.yaml")
)

function Write-Tree {
    param(
        [string]$CurrentPath,
        [string]$Indent = "",
        [int]$Depth = 0
    )

    if ($Depth -ge $MaxDepth) {
        return
    }

    $items = Get-ChildItem -LiteralPath $CurrentPath -Force |
        Where-Object {
            $_.Name -notin @(".", "..") -and
            -not ($_.PSIsContainer -and $ExcludeDirs -contains $_.Name) -and
            -not (-not $_.PSIsContainer -and $ExcludeFiles -contains $_.Name)
        } |
        Sort-Object { -not $_.PSIsContainer }, Name

    for ($i = 0; $i -lt $items.Count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq $items.Count - 1)

        $connector = if ($isLast) { "└── " } else { "├── " }
        Write-Output ("{0}{1}{2}" -f $Indent, $connector, $item.Name)

        if ($item.PSIsContainer) {
            $childIndent = if ($isLast) { "$Indent    " } else { "$Indent│   " }
            Write-Tree -CurrentPath $item.FullName -Indent $childIndent -Depth ($Depth + 1)
        }
    }
}

# Make sure we print a plain string, not a PathInfo object
$root = (Resolve-Path -LiteralPath $Path).Path

Write-Output $root
Write-Tree -CurrentPath $root
