$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
Write-Host "Server running at http://localhost:8000/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    
    $relPath = $req.Url.LocalPath
    if ($relPath -eq "/") { $relPath = "/index.html" }
    
    $filePath = Join-Path "C:\Users\cheth\Desktop\RAKSHAAN" $relPath.TrimStart('/')
    
    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        
        switch ($ext) {
            ".css"  { $res.ContentType = "text/css" }
            ".js"   { $res.ContentType = "application/javascript" }
            ".png"  { $res.ContentType = "image/png" }
            ".jpg"  { $res.ContentType = "image/jpeg" }
            ".json" { $res.ContentType = "application/json" }
            default { $res.ContentType = "text/html" }
        }
        
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
    }
    $res.OutputStream.Close()
}
