# PowerShell helper to run backend tests
param()

Write-Host "Running backend tests..."

try {
    npm run test:backend
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} catch {
    Write-Error "Failed to run tests: $_"
    exit 1
}
