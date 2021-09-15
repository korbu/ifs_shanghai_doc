@echo off
echo %~dp0
xcopy \\cnsha1fs002\IFS\ifs_shanghai_doc\*.* %~dp0img\ /s /h /d /y
pause
exit