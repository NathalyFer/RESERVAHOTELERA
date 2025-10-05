@echo off
REM Script para iniciar el servidor con Gunicorn en Windows

REM Activar entorno virtual si existe
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM Iniciar Gunicorn
gunicorn -c gunicorn_config.py main:app

pause
