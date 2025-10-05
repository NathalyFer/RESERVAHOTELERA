"""
Configuración de Gunicorn para FastAPI
"""
import multiprocessing
import os

# Dirección y puerto donde escuchará el servidor
bind = "0.0.0.0:8000"

# Número de workers (procesos)
# Fórmula recomendada: (2 x núcleos CPU) + 1
workers = multiprocessing.cpu_count() * 2 + 1

# Clase de worker para aplicaciones ASGI (FastAPI)
worker_class = "uvicorn.workers.UvicornWorker"

# Timeout en segundos (para requests largos)
timeout = 120

# Mantener conexiones keep-alive
keepalive = 5

# Nivel de logging
loglevel = "info"

# Archivo de log de acceso
accesslog = "-"  # "-" significa stdout (consola)

# Archivo de log de errores
errorlog = "-"   # "-" significa stderr (consola)

# Formato de log de acceso
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Reiniciar workers después de N requests (previene memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Directorio de trabajo
chdir = os.path.dirname(__file__)

# Preload de la aplicación (mejora rendimiento pero dificulta debugging)
preload_app = False

# Recargar automáticamente cuando cambia el código (solo desarrollo)
reload = True  # Cambiar a False en producción
