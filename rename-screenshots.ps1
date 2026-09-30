# Run this inside your repo folder (where the screenshots are).
# It renames each screenshot (spaces or underscores, doesn't matter) to a clean web-safe name.
$map = [ordered]@{
  "153102" = "01-flood-zone"
  "153219" = "02-sensor-fusion"
  "154055" = "03-priority-queue"
  "154104" = "04-telemetry"
  "154113" = "05-event-trace"
  "154205" = "06-landslide"
  "154408" = "07-tablet-map"
  "154414" = "08-tablet-survivors"
  "154423" = "09-tablet-hazards"
  "154430" = "10-tablet-drone-status"
  "154437" = "11-tablet-comms"
  "154443" = "12-tablet-report"
  "154455" = "13-cyclone"
  "154556" = "14-feed-rgb"
  "154652" = "15-feed-thermal"
  "154724" = "16-feed-lidar"
}
foreach ($k in $map.Keys) {
  $f = Get-ChildItem -File -Filter "*$k*.png" | Where-Object { $_.Name -like "Screenshot*" } | Select-Object -First 1
  if ($f) { Rename-Item $f.FullName -NewName "$($map[$k]).png"; Write-Host "OK   $($f.Name) -> $($map[$k]).png" }
  else    { Write-Host "MISSING screenshot containing $k" -ForegroundColor Yellow }
}
