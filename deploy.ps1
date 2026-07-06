# 一键部署(PowerShell 包装)。
#
#   .\deploy.ps1
#
# 薄壳:通过 Git Bash 调用 ./deploy.sh,保证打包/上传行为和测试过的 bash 路径一致。
# 用 ~/.ssh/ttgame_deploy 密钥免密,无需输密码。
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$bash = @(
  "$env:ProgramFiles\Git\bin\bash.exe",
  "${env:ProgramFiles(x86)}\Git\bin\bash.exe",
  "$env:LOCALAPPDATA\Programs\Git\bin\bash.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $bash) {
  Write-Error '未找到 Git Bash (bash.exe)。请安装 Git for Windows,或在 Git Bash 里跑 ./deploy.sh。'
  exit 1
}

$posixRoot = ($root -replace '\\', '/')
& $bash -lc "cd '$posixRoot' && ./deploy.sh"
exit $LASTEXITCODE
