param(
  [string]$OutFile = "PROJECT_SNAPSHOT_FOR_CLAUDE.md",
  [int]$MaxLines = 2000
)

function SkipPath([string]$p) {
  return ($p -match "\\node_modules\\") -or ($p -match "\\dist\\") -or ($p -match "\\\.astro\\") -or ($p -match "\\\.git\\")
}

function WriteLine([string]$t) { Add-Content -Encoding UTF8 $OutFile ($t + "`n") }
function WriteHeader([string]$t) { WriteLine "`n# $t`n" }

function DumpFile([string]$path) {
  if (!(Test-Path $path)) { return }
  $full = (Resolve-Path $path).Path
  if (SkipPath $full) { return }

  # Skip binaries
  if ($path -match "\.pdf$|\.png$|\.jpg$|\.jpeg$|\.webp$|\.gif$|\.ico$|\.mp4$|\.mov$") { return }

  $lines = Get-Content $path -ErrorAction SilentlyContinue
  if ($null -eq $lines) { return }

  WriteLine "`n---`n"
  WriteLine "## FILE: $path"
  WriteLine "```"
  $take = $lines | Select-Object -First $MaxLines
  WriteLine ($take -join "`n")
  if ($lines.Count -gt $MaxLines) { WriteLine "`n... [TRUNCATED] ..." }
  WriteLine "```"
}

# Start
if (Test-Path $OutFile) { Remove-Item -Force $OutFile }

WriteLine "# PROJECT SNAPSHOT FOR CLAUDE"
WriteLine ("Generated: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss"))

WriteHeader "REPO + DEPLOY"
WriteLine ("Repo root: " + (git rev-parse --show-toplevel 2>$null))
WriteLine ("Branch: " + (git branch --show-current 2>$null))
WriteLine "Remote:"
WriteLine (git remote -v 2>$null | Out-String)
WriteLine "Deploy: Hostinger via GitHub Actions (FTP upload of site/dist to /public_html)"

WriteHeader "ROOT FILES"
DumpFile ".gitignore"
DumpFile ".vscode\tasks.json"
DumpFile ".vscode\settings.json"

if (!(Test-Path "site")) {
  WriteHeader "ERROR"
  WriteLine "Missing ./site folder."
  exit 1
}

WriteHeader "FILE TREE (filtered)"
$siteRoot = (Resolve-Path ".\site").Path
$all = Get-ChildItem ".\site" -Recurse -Force -File | Where-Object { -not (SkipPath $_.FullName) } | Sort-Object FullName
WriteLine "```"
foreach ($f in $all) {
  $rel = $f.FullName.Substring($siteRoot.Length + 1)
  WriteLine $rel
}
WriteLine "```"

WriteHeader "SITE CONFIG"
DumpFile "site\package.json"
DumpFile "site\astro.config.mjs"
DumpFile "site\tsconfig.json"
DumpFile "site\tailwind.config.cjs"
DumpFile "site\tailwind.config.mjs"
DumpFile "site\src\styles\global.css"

WriteHeader "LAYOUTS"
DumpFile "site\src\layouts\BaseLayout.astro"

WriteHeader "PAGES (ROUTES)"
$pages = Get-ChildItem ".\site\src\pages" -Recurse -Force -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -in ".astro",".ts",".tsx",".css",".json",".mjs",".cjs" } |
  Where-Object { -not (SkipPath $_.FullName) } |
  Sort-Object FullName
foreach ($p in $pages) {
  $rel = $p.FullName.Substring($siteRoot.Length + 1)
  DumpFile ("site\" + $rel)
}

WriteHeader "COMPONENTS"
$comps = Get-ChildItem ".\site\src\components" -Recurse -Force -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -in ".astro",".ts",".tsx",".css",".json",".mjs",".cjs" } |
  Where-Object { -not (SkipPath $_.FullName) } |
  Sort-Object FullName
foreach ($c in $comps) {
  $rel = $c.FullName.Substring($siteRoot.Length + 1)
  DumpFile ("site\" + $rel)
}

WriteHeader "DATA"
$data = Get-ChildItem ".\site\src\data" -Recurse -Force -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -in ".ts",".tsx",".json" } |
  Where-Object { -not (SkipPath $_.FullName) } |
  Sort-Object FullName
foreach ($d in $data) {
  $rel = $d.FullName.Substring($siteRoot.Length + 1)
  DumpFile ("site\" + $rel)
}

WriteHeader "PUBLIC ASSETS NOTE"
WriteLine "- CV file should be at: site/public/resume.pdf (served as /resume.pdf)"
WriteLine ""
WriteLine ("DONE. Snapshot saved to: " + $OutFile)
