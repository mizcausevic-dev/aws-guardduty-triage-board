$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $altAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $bulletFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)

    $graphics.DrawString("AWS GuardDuty Triage Board", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.DrawString("•", $bulletFont, $altAccentBrush, 108, $y)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Title "Overview proof" `
    -Subtitle "Detector coverage, credential abuse, compromise signals, and exfiltration posture in one AWS GuardDuty operator surface." `
    -Bullets @(
        "High-severity GuardDuty findings surface before audit, response, or release trust drifts.",
        "Disabled detectors and missing data sources remain visible instead of buried in console state.",
        "Response packets make SOC, platform, and governance ownership explicit."
    )

New-ProofImage -Path (Join-Path $screenshots "02-detector-lane-proof.png") `
    -Title "Detector lane" `
    -Subtitle "Every lane keeps owner, threat focus, status, and next action visible." `
    -Bullets @(
        "Detector coverage, credential abuse, runtime compromise, and exfiltration lanes stay separated cleanly.",
        "Regional coverage drift remains obvious.",
        "Response paths are ready for operator review."
    )

New-ProofImage -Path (Join-Path $screenshots "03-finding-risks-proof.png") `
    -Title "Finding risks" `
    -Subtitle "Findings map severity, owner, principal, region, and the exact GuardDuty rule that fired." `
    -Bullets @(
        "Credential exfiltration and S3 exfiltration signals surface first.",
        "Owner mapping keeps SOC and platform accountability explicit.",
        "The lane is grounded in GuardDuty detector evidence."
    )

New-ProofImage -Path (Join-Path $screenshots "04-response-posture-proof.png") `
    -Title "Response posture" `
    -Subtitle "Packets tie completeness, blocker, owner, and response timing together." `
    -Bullets @(
        "Credential containment, runtime isolation, and bucket containment stay readable.",
        "Red/yellow/green response posture is easy to scan.",
        "The system is shaped for real AWS threat triage proof."
    )
