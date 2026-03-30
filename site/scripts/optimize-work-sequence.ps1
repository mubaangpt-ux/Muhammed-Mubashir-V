param(
  [string]$SourceDir = "public/sequences/work-hero",
  [int]$Width = 1920,
  [int]$Height = 1080,
  [int]$Quality = 82
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$repoRoot = Split-Path -Parent $PSScriptRoot
$resolvedSource = Resolve-Path (Join-Path $repoRoot $SourceDir)
$sourcePath = $resolvedSource.Path
$tempDir = Join-Path (Split-Path $sourcePath -Parent) "work-hero-optimized"

if (Test-Path $tempDir) {
  Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" } |
  Select-Object -First 1

$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality,
  [long]$Quality
)

$files = Get-ChildItem -LiteralPath $sourcePath -Filter *.jpg | Sort-Object Name

foreach ($file in $files) {
  $sourceImage = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.Clear([System.Drawing.Color]::Black)
        $graphics.DrawImage($sourceImage, 0, 0, $Width, $Height)
      } finally {
        $graphics.Dispose()
      }

      $targetPath = Join-Path $tempDir $file.Name
      $bitmap.Save($targetPath, $jpegCodec, $encoderParams)
    } finally {
      $bitmap.Dispose()
    }
  } finally {
    $sourceImage.Dispose()
  }
}

Get-ChildItem -LiteralPath $sourcePath -Filter *.jpg | Remove-Item -Force
Get-ChildItem -LiteralPath $tempDir -Filter *.jpg | Move-Item -Destination $sourcePath
Remove-Item -Recurse -Force $tempDir

Write-Host "Optimized $($files.Count) frames to ${Width}x${Height} at JPEG quality $Quality."
