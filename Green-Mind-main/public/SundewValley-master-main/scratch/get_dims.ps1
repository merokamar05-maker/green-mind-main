Add-Type -AssemblyName System.Drawing
$fullPath = Resolve-Path "images/characters/grandmother.png"
$img = [System.Drawing.Image]::FromFile($fullPath)
Write-Output "Width:$($img.Width)"
Write-Output "Height:$($img.Height)"
$img.Dispose()
