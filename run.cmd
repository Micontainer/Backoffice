@ECHO OFF

@REM npm start

SET stage=%1

ECHO Running enviroment %stage%

if "%stage%"=="" (
  ng serve
)

if "%stage%"=="build" (
  npm run build:dev
)

if "%stage%"=="release" (
  npm run build
)
