# PowerShell Script to run a simple HTTP server
#
# Instructions for end-user:
# 1. Unzip the survey folder.
# 2. Double-click the 'start.bat' file.
# 3. The survey will open in your default web browser.

$ports = 8000, 8080, 8888, 9000
$webroot = $PSScriptRoot

function Test-Port {
    param($port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("127.0.0.1", $port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

function Stop-ProcessUsingPort {
    param($port)
    $process = Get-Process -Id (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Port $port is in use by process $($process.Name) (PID $($process.Id))."
        Write-Host "Stopping process..."
        Stop-Process -Id $process.Id -Force
        Start-Sleep -Seconds 1 # Give it a moment to release the port
    }
}

$selectedPort = $null
foreach ($port in $ports) {
    if (Test-Port -port $port) {
        Write-Host "Port $port is currently in use."
        Stop-ProcessUsingPort -port $port
    }
    $selectedPort = $port
    break
}

if (-not $selectedPort) {
    Write-Error "All fallback ports are in use. Please free up one of the following ports: $($ports -join ', ')"
    exit 1
}

# Create an HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$selectedPort/")
$listener.Prefixes.Add("http://127.0.0.1:$selectedPort/")

try {
    $listener.Start()
    Write-Host "Server started at http://localhost:$selectedPort"
    Write-Host "Press CTRL+C to stop the server."

    # Open the default browser to the survey page
    Start-Process "http://localhost:$selectedPort/index.html"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $filePath = $webroot + $request.Url.LocalPath
        
        # Default to index.html if a directory is requested
        if ([System.IO.Directory]::Exists($filePath)) {
            $filePath = Join-Path -Path $filePath -ChildPath "index.html"
        }

        if ([System.IO.File]::Exists($filePath)) {
            try {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $content.Length
                
                # Set MIME type based on file extension
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mimeType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css" }
                    ".js"   { "application/javascript" }
                    ".json" { "application/json" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".gif"  { "image/gif" }
                    ".svg"  { "image/svg+xml" }
                    ".ico"  { "image/x-icon" }
                    ".woff" { "font/woff" }
                    ".woff2"{ "font/woff2" }
                    default { "application/octet-stream" }
                }
                $response.ContentType = $mimeType

                $response.OutputStream.Write($content, 0, $content.Length)
            } catch {
                $response.StatusCode = 500 # Internal Server Error
                Write-Host "Error reading file: $($_.Exception.Message)"
            }
        } else {
            # For service worker, if the root is requested, serve index.html
            if ($request.Url.LocalPath -eq "/service-worker.js") {
                 $response.StatusCode = 404
            } else {
                $response.StatusCode = 404 # Not Found
            }
            Write-Host "File not found: $filePath"
        }
        
        $response.Close()
    }
}
catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
}
finally {
    if ($listener.IsListening) {
        $listener.Stop()
        Write-Host "Server stopped."
    }
}
