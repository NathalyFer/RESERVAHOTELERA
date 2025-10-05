"""
Servidor Waitress para Windows (alternativa a Gunicorn)
"""
from waitress import serve
from main import app

if __name__ == "__main__":
    print("🚀 Iniciando servidor Waitress...")
    print("📍 Servidor corriendo en: http://localhost:8000")
    print("📚 Documentación: http://localhost:8000/docs")
    print("⏹️  Presiona CTRL+C para detener")
    
    serve(
        app,
        host="0.0.0.0",
        port=8000,
        threads=4,  # Número de threads
        url_scheme="http"
    )
