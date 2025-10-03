# Configuración de Auth0

## ✅ Cambios Realizados

1. **Actualizado `src/environments/environment.ts`** y **`environment.prod.ts`**:
   - Agregada configuración de Auth0 con placeholders.

2. **Actualizado `src/app/app.module.ts`**:
   - Importado `AuthModule` de `@auth0/auth0-angular`.
   - Configurado `AuthModule.forRoot()` con variables de entorno.

## 🔧 Pasos para Completar la Configuración

### 1. Obtener Credenciales de Auth0

Si aún no tienes una cuenta de Auth0:

1. Ve a [https://auth0.com](https://auth0.com) y crea una cuenta gratuita.
2. Crea una nueva aplicación:
   - Dashboard → Applications → Create Application
   - Nombre: "Gestión Hotelera" (o el que prefieras)
   - Tipo: **Single Page Application**
3. En la pestaña **Settings** de tu aplicación, encontrarás:
   - **Domain**: Ej. `tu-app.us.auth0.com`
   - **Client ID**: Ej. `abc123xyz...`

### 2. Configurar Allowed Callback URLs en Auth0

En la configuración de tu aplicación en Auth0, agrega estas URLs:

**Allowed Callback URLs:**
```
http://localhost:8100,
http://localhost:8100/home
```

**Allowed Logout URLs:**
```
http://localhost:8100,
http://localhost:8100/login
```

**Allowed Web Origins:**
```
http://localhost:8100
```

### 3. Actualizar Variables de Entorno

Edita `src/environments/environment.ts` y reemplaza los placeholders:

```typescript
export const environment = {
  production: false,
  auth0: {
    domain: 'TU-DOMINIO.us.auth0.com',  // ← Reemplaza con tu dominio
    clientId: 'TU-CLIENT-ID',            // ← Reemplaza con tu Client ID
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'YOUR_AUTH0_AUDIENCE' // Opcional: solo si usas Auth0 API
    }
  }
};
```

Haz lo mismo en `src/environments/environment.prod.ts` para producción.

### 4. Habilitar Google OAuth (para loginCalendar)

Para que funcione el botón de login con Google Calendar:

1. En Auth0 Dashboard → Authentication → Social
2. Click en **Google**
3. Habilita la conexión y configura:
   - Obtén credenciales de Google Cloud Console
   - Agrega los scopes necesarios: `openid profile email https://www.googleapis.com/auth/calendar`

### 5. Reiniciar el Servidor de Desarrollo

```bash
# Detén el servidor si está corriendo (Ctrl+C)
# Luego reinicia:
npm start
```

## 🚀 Probar el Login

1. Navega a `http://localhost:8100/login`
2. El login debería cargar sin errores de "No provider for AuthService"
3. Prueba el botón de login con Google Calendar

## 📝 Notas Importantes

- **Seguridad**: Nunca subas `environment.ts` con credenciales reales a un repositorio público.
- **Audience**: Solo necesitas configurar `audience` si tu app consume una API protegida con Auth0.
- Si no quieres usar `audience`, puedes eliminar esa línea de la configuración.

## ❓ Solución de Problemas

### Error: "No provider for AuthService"
- Verifica que `AuthModule.forRoot()` esté en `app.module.ts`.
- Asegúrate de haber reiniciado el servidor después de los cambios.

### Error: "Invalid callback URL"
- Verifica que las URLs en Auth0 coincidan exactamente con tu entorno local.
- No olvides guardar los cambios en Auth0 Dashboard.

### El login con Google no funciona
- Verifica que la conexión de Google esté habilitada en Auth0.
- Asegúrate de tener los scopes correctos configurados.
