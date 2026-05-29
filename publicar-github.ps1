# Publica o portfólio em: https://github.com/victorhugoaurelianocoltro/portifolio---RM.git
# Execute no PowerShell: clique direito > Executar com PowerShell
# OU: cd na pasta do projeto e rode: .\publicar-github.ps1

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/victorhugoaurelianocoltro/portifolio---RM.git"
$projectDir = $PSScriptRoot

# Localizar Git
$git = $null
@(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe"
) | ForEach-Object {
    if (Test-Path $_) { $git = $_ }
}
if (-not $git) {
    $cmd = Get-Command git -ErrorAction SilentlyContinue
    if ($cmd) { $git = $cmd.Source }
}

if (-not $git) {
    Write-Host ""
    Write-Host "Git nao encontrado." -ForegroundColor Red
    Write-Host "Instale em: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Depois execute este script novamente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "IMPORTANTE: O repositorio esta ARQUIVADO no GitHub." -ForegroundColor Magenta
    Write-Host "Desarquive em: Settings > Danger Zone > Unarchive repository" -ForegroundColor Magenta
    Write-Host "Link: https://github.com/victorhugoaurelianocoltro/portifolio---RM/settings" -ForegroundColor Cyan
    pause
    exit 1
}

Set-Location $projectDir
Write-Host "Usando Git: $git" -ForegroundColor Green
Write-Host "Pasta: $projectDir" -ForegroundColor Green

if (-not (Test-Path ".git")) {
    & $git init
    & $git branch -M main
}

$remote = & $git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    & $git remote add origin $repoUrl
} else {
    & $git remote set-url origin $repoUrl
}

& $git add .
& $git status

Write-Host ""
Write-Host "Fazendo commit..." -ForegroundColor Cyan
& $git commit -m "Portfólio RM Engenharia Elétrica - site corporativo premium" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nada novo para commitar ou commit ja existe. Continuando..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Sincronizando com o GitHub..." -ForegroundColor Cyan
& $git pull origin main --allow-unrelated-histories --no-edit 2>$null

Write-Host "Enviando para GitHub (pode pedir login)..." -ForegroundColor Cyan
& $git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Sucesso! Repositorio atualizado:" -ForegroundColor Green
    Write-Host "https://github.com/victorhugoaurelianocoltro/portifolio---RM" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para site online: Settings > Pages > Branch main / root" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Falha no push. Verifique:" -ForegroundColor Red
    Write-Host "1. Repositorio DESARQUIVADO (Settings > Unarchive)" -ForegroundColor Yellow
    Write-Host "2. Voce tem permissao de escrita no repositorio" -ForegroundColor Yellow
    Write-Host "3. Login GitHub configurado (git config ou Git Credential Manager)" -ForegroundColor Yellow
}

pause
