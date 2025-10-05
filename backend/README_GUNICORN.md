# 🚀 Guía para Ejecutar el Servidor con Gunicorn

## 📋 Requisitos Previos

1. **Python 3.8+** instalado
2. **Entorno virtual** configurado (recomendado)

## 🔧 Instalación

### 1. Crear y activar entorno virtual (si no existe)

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

## ▶️ Ejecutar el Servidor

### Opción 1: Con Gunicorn (Producción)

**Windows:**
```powershell
# Método 1: Usando el script
.\start_server.bat

# Método 2: Comando directo
gunicorn -c gunicorn_config.py main:app
```

**Linux/Mac:**
```bash
# Método 1: Usando el script
chmod +x start_server.sh
./start_server.sh

# Método 2: Comando directo
gunicorn -c gunicorn_config.py main:app
```

### Opción 2: Con Uvicorn (Desarrollo)

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🎛️ Configuración de Gunicorn

El archivo `gunicorn_config.py` contiene la configuración:

- **Puerto:** 8000
- **Workers:** Calculados automáticamente según CPU
- **Worker Class:** uvicorn.workers.UvicornWorker (para ASGI/FastAPI)
- **Timeout:** 120 segundos
- **Reload:** Activado (desactivar en producción)

### Modificar configuración

Edita `gunicorn_config.py` para cambiar:

```python
# Cambiar puerto
bind = "0.0.0.0:8080"

# Cambiar número de workers
workers = 4

# Desactivar reload en producción
reload = False
```

## 🌐 Acceder a la Aplicación

Una vez iniciado el servidor:

- **API:** http://localhost:8000
- **Documentación Swagger:** http://localhost:8000/docs
- **Documentación ReDoc:** http://localhost:8000/redoc

## 📊 Comandos Útiles

### Ver logs en tiempo real
Los logs se muestran en la consola automáticamente.

### Ejecutar en background (Linux/Mac)
```bash
gunicorn -c gunicorn_config.py main:app --daemon
```

### Detener servidor en background
```bash
pkill -f gunicorn
```

### Ejecutar con más workers
```bash
gunicorn -c gunicorn_config.py main:app --workers 8
```

### Ejecutar sin reload (producción)
```bash
gunicorn -c gunicorn_config.py main:app --reload=False
```

## 🐛 Solución de Problemas

### Error: "gunicorn: command not found"
```bash
pip install gunicorn
```

### Error: "No module named 'uvicorn.workers'"
```bash
pip install uvicorn[standard]
```

### Puerto 8000 ya en uso
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Cambiar puerto temporalmente
```bash
gunicorn -c gunicorn_config.py main:app --bind 0.0.0.0:8080
```

## 🔒 Notas de Seguridad

1. **Nunca** expongas directamente Gunicorn a Internet en producción
2. Usa un **proxy reverso** (Nginx, Apache) delante de Gunicorn
3. Configura **HTTPS** con certificados SSL
4. Limita **CORS** a dominios específicos en producción

## 📈 Optimización para Producción

### 1. Desactivar reload
```python
# En gunicorn_config.py
reload = False
```

### 2. Activar preload
```python
# En gunicorn_config.py
preload_app = True
```

### 3. Ajustar workers según carga
```python
# Para CPU-bound
workers = multiprocessing.cpu_count() * 2 + 1

# Para I/O-bound (más requests concurrentes)
workers = multiprocessing.cpu_count() * 4
```

### 4. Configurar logs en archivos
```python
# En gunicorn_config.py
accesslog = "/var/log/gunicorn/access.log"
errorlog = "/var/log/gunicorn/error.log"
```

## 🔄 Comparación: Uvicorn vs Gunicorn

| Característica | Uvicorn | Gunicorn + Uvicorn |
|----------------|---------|---------------------|
| **Desarrollo** | ✅ Ideal | ⚠️ Sobrecarga |
| **Producción** | ⚠️ Single process | ✅ Multi-process |
| **Hot reload** | ✅ Nativo | ⚠️ Configuración |
| **Escalabilidad** | ❌ Limitada | ✅ Excelente |
| **Simplicidad** | ✅ Simple | ⚠️ Más complejo |

## 📚 Recursos

- [Documentación Gunicorn](https://docs.gunicorn.org/)
- [Documentación Uvicorn](https://www.uvicorn.org/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

**¡Listo!** Tu servidor FastAPI está corriendo con Gunicorn 🎉
