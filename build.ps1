$cssDir = "assets/css"
$outFile = "assets/css/style.css"

$layerMap = @{
  "reset.css" = "reset"
  "variables.css" = "tokens"
  "base.css" = "base"
  "responsive.css" = "responsive"
}

$order = @(
  "reset.css", "variables.css", "base.css", "nav.css", "hero.css",
  "about.css", "education.css", "experience.css", "projects.css",
  "skills.css", "career-goals.css", "contact.css", "footer.css",
  "responsive.css"
)

$content = "@layer reset, tokens, base, components, responsive;`n`n"
foreach ($file in $order) {
  $layer = if ($layerMap.ContainsKey($file)) { $layerMap[$file] } else { "components" }
  $content += "/* === $file === */`n"
  $content += "@layer $layer {`n"
  $content += (Get-Content "$cssDir/$file" -Raw)
  $content += "`n}`n`n"
}

Set-Content -Path $outFile -Value $content -Encoding UTF8
Write-Host "Built CSS bundle: $outFile"
