@echo off

set nowpath=%CD%
set curpath=

if "%1" == "" ( goto :getgopath ) else (
	set curpath=%1
	goto :setgopath
)

:getgopath
for /f "tokens=1* delims=\" %%a in ("%nowpath%") do (
	if "%%a" == "src" (
		goto :setgopath
	) else (
		if "%curpath%" == "" (
			set curpath=%%a
		) else (
			set curpath=%curpath%\%%a
		)
		set nowpath=%%b
	)
)
if defined nowpath ( goto :getgopath ) else ( goto :end )


:setgopath
if not "%curpath%" == "" (
	set GOPATH=%GOPATH%;%curpath%
)
goto :end


:end
echo %GOPATH%
pause