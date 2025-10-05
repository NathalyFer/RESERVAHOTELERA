#!/bin/bash
# Script para iniciar el servidor con Gunicorn en Linux/Mac

# Activar entorno virtual si existe
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Iniciar Gunicorn
gunicorn -c gunicorn_config.py main:app
