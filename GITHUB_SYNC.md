# 📦 Guía para Sincronizar con GitHub

## 🚀 Opción 1: Primera Vez (Crear Repositorio Nuevo)

### Paso 1: Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Click en el botón **"+"** (arriba derecha) → **"New repository"**
3. Configura tu repositorio:
   - **Repository name**: `sumativa1-hotel` (o el nombre que prefieras)
   - **Description**: "Sistema de gestión hotelera con Angular/Ionic"
   - **Visibility**: 
     - ✅ **Private** (recomendado, protege tus credenciales)
     - ⚠️ **Public** (solo si estás seguro de no subir datos sensibles)
   - ❌ **NO** marques "Initialize with README" (ya tienes archivos)
4. Click en **"Create repository"**

### Paso 2: Inicializar Git Localmente

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Navega a la carpeta del proyecto
cd "c:\Users\aurac\OneDrive\duoc 2doaño\sumativa1-master"

# Inicializa Git
git init

# Configura tu nombre y email (solo la primera vez)
git config user.name "Tu Nombre"
git config user.email "tu-email@ejemplo.com"
```

### Paso 3: Agregar Archivos y Hacer Commit

```bash
# Agrega todos los archivos (respetando .gitignore)
git add .

# Verifica qué archivos se agregarán
git status

# Crea el primer commit
git commit -m "Initial commit: Sistema de gestión hotelera"
```

### Paso 4: Conectar con GitHub

Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con tus datos:

```bash
# Conecta con tu repositorio remoto
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# Cambia el nombre de la rama a 'main' (estándar actual)
git branch -M main

# Sube los cambios a GitHub
git push -u origin main
```

**Ejemplo:**
```bash
git remote add origin https://github.com/juanperez/sumativa1-hotel.git
git branch -M main
git push -u origin main
```

---

## 🔄 Opción 2: Repositorio Ya Existe (Clonar y Actualizar)

Si ya tienes un repositorio en GitHub y quieres subir cambios:

```bash
# Navega a la carpeta del proyecto
cd "c:\Users\aurac\OneDrive\duoc 2doaño\sumativa1-master"

# Verifica el estado
git status

# Agrega los cambios
git add .

# Crea un commit con un mensaje descriptivo
git commit -m "Descripción de los cambios realizados"

# Sube los cambios
git push origin main
```

---

## 📝 Comandos Útiles de Git

### Ver Estado del Repositorio
```bash
git status
```

### Ver Historial de Commits
```bash
git log --oneline
```

### Agregar Archivos Específicos
```bash
git add src/app/home/home.page.ts
git add backend/main.py
```

### Deshacer Cambios (antes de commit)
```bash
# Deshacer cambios en un archivo
git checkout -- nombre-archivo.ts

# Deshacer todos los cambios
git reset --hard
```

### Ver Diferencias
```bash
# Ver cambios no guardados
git diff

# Ver cambios en un archivo específico
git diff src/app/home/home.page.ts
```

### Crear una Nueva Rama
```bash
# Crear y cambiar a una nueva rama
git checkout -b feature/nueva-funcionalidad

# Subir la nueva rama a GitHub
git push -u origin feature/nueva-funcionalidad
```

### Actualizar desde GitHub (Pull)
```bash
# Descargar cambios del repositorio remoto
git pull origin main
```

---

## 🔐 Seguridad: Archivos Protegidos

El archivo `.gitignore` ya está configurado para **NO subir**:

✅ **Archivos protegidos:**
- `backend/.env` (credenciales de base de datos)
- `src/environments/environment.ts` (credenciales de Auth0)
- `src/environments/environment.prod.ts`
- `node_modules/` (dependencias, se reinstalan con npm)
- Archivos temporales y de compilación

⚠️ **IMPORTANTE**: Antes de hacer push, verifica que no subes credenciales:

```bash
# Ver qué archivos se subirán
git status

# Si ves archivos sensibles, agrégalos a .gitignore
```

---

## 📋 Workflow Recomendado

### Cada vez que trabajes en el proyecto:

1. **Antes de empezar** (actualizar):
   ```bash
   git pull origin main
   ```

2. **Mientras trabajas** (guardar progreso):
   ```bash
   git add .
   git commit -m "Descripción clara de los cambios"
   ```

3. **Al terminar** (subir cambios):
   ```bash
   git push origin main
   ```

### Mensajes de Commit Claros

Buenos ejemplos:
```bash
git commit -m "feat: Agregar página de habitaciones"
git commit -m "fix: Corregir navegación del menú home"
git commit -m "style: Actualizar estilos del login"
git commit -m "docs: Agregar documentación de Oracle Cloud"
```

---

## 🆘 Solución de Problemas

### Error: "remote origin already exists"
```bash
# Elimina el remoto existente
git remote remove origin

# Agrega el nuevo
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
```

### Error: "failed to push some refs"
```bash
# Primero descarga los cambios remotos
git pull origin main --rebase

# Luego sube tus cambios
git push origin main
```

### Error: "Authentication failed"
```bash
# Usa un Personal Access Token en lugar de contraseña
# Ve a GitHub → Settings → Developer settings → Personal access tokens
# Genera un token y úsalo como contraseña al hacer push
```

### Subiste archivos sensibles por error
```bash
# Elimina el archivo del historial (CUIDADO: reescribe historial)
git rm --cached backend/.env
git commit -m "Remove sensitive file"
git push origin main --force

# Luego agrega el archivo a .gitignore
echo "backend/.env" >> .gitignore
git add .gitignore
git commit -m "Update .gitignore"
git push origin main
```

---

## 🎯 Resumen Rápido

```bash
# 1. Inicializar (solo primera vez)
git init
git add .
git commit -m "Initial commit"

# 2. Conectar con GitHub (solo primera vez)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main

# 3. Workflow diario
git add .
git commit -m "Descripción de cambios"
git push origin main
```

---

## 📚 Recursos Adicionales

- [Documentación oficial de Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**¡Listo!** Ahora tu proyecto está sincronizado con GitHub y puedes colaborar, hacer backups automáticos y mantener un historial de cambios. 🎉
