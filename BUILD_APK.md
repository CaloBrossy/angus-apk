# 📱 Generar APK - Angus Connect Hub

## 🚀 Pasos para Generar el APK

### 1. **Preparación del Proyecto**
```bash
# Instalar dependencias (si no están instaladas)
npm install

# Construir la aplicación web
npm run build

# Sincronizar con Capacitor
npx cap sync
```

### 2. **Generar APK con Android Studio**

#### Opción A: Usando Android Studio (Recomendado)
```bash
# Abrir el proyecto en Android Studio
npx cap open android
```

**En Android Studio:**
1. Espera a que se sincronice el proyecto
2. Ve a **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Opción B: Usando Gradle directamente
```bash
# Generar APK debug
cd android
./gradlew assembleDebug

# El APK estará en: android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. **Scripts Disponibles**

```bash
# Build completo y abrir Android Studio
npm run android:build

# Solo sincronizar cambios
npm run android:sync

# Ejecutar en dispositivo/emulador
npm run android:run

# Build completo para APK
npm run android:build-apk
```

## 📋 Requisitos

### **Software Necesario:**
- ✅ **Node.js** (v18+)
- ✅ **Android Studio** (para generar APK)
- ✅ **Java Development Kit (JDK)** (v11+)

### **Configuración Android Studio:**
1. Instalar Android SDK
2. Configurar variables de entorno:
   - `ANDROID_HOME` → Ruta del SDK
   - `JAVA_HOME` → Ruta del JDK

## 🔧 Configuración del Proyecto

### **Archivo de Configuración:**
- `capacitor.config.ts` - Configuración principal de Capacitor
- `android/app/build.gradle` - Configuración de Android

### **Información de la App:**
- **Nombre**: Angus Connect Hub
- **Package**: com.angus.connecthub
- **Versión**: Configurada en `android/app/build.gradle`

## 📱 Instalación del APK

### **En Dispositivo Android:**
1. Habilitar "Fuentes desconocidas" en Configuración
2. Transferir el APK al dispositivo
3. Instalar desde el explorador de archivos

### **Ubicación del APK:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 🛠️ Solución de Problemas

### **Error: "SDK not found"**
```bash
# Verificar instalación del SDK
npx cap doctor
```

### **Error: "Gradle sync failed"**
```bash
# Limpiar y reconstruir
cd android
./gradlew clean
./gradlew build
```

### **Error: "Build failed"**
```bash
# Verificar dependencias
npm run android:sync
```

## 📝 Notas Importantes

- **APK Debug**: Para pruebas y desarrollo
- **APK Release**: Para producción (requiere firma digital)
- **Tamaño**: El APK incluye toda la aplicación web empaquetada
- **Actualizaciones**: Los cambios web requieren nuevo build del APK

## 🎯 Próximos Pasos

1. **Generar APK Release** (para producción)
2. **Configurar firma digital** (para Play Store)
3. **Optimizar tamaño** del APK
4. **Configurar notificaciones push** (opcional)

---

**¡Tu aplicación Angus Connect Hub está lista para Android!** 🎉
