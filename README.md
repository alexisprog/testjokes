# Chuck Norris Jokes App 💪

Aplicación móvil desarrollada con Expo que consume la API de Chuck Norris para mostrar chistes aleatorios, búsquedas y gestión de favoritos.

## Ambiente de Desarrollo

- Node.js: v18.x o superior
- npm: v9.x o superior
- Expo SDK: 50.0.0
- React Native: 0.73.2
- TypeScript: 5.3.0

## Dependencias Principales

- **UI/UX**:

  - `react-native-paper`: ^5.12.3 (Sistema de diseño material)
  - `react-native-safe-area-context`: ^4.8.2
  - `@expo/vector-icons`: ^14.0.0

- **Navegación**:

  - `expo-router`: ^3.4.6 (Navegación basada en archivos)
  - `react-native-gesture-handler`: ^2.14.0

- **Estado**:

  - `zustand`: ^4.5.0 (Gestión de estado global)
  - `@react-native-async-storage/async-storage`: ^1.21.0

- **Autenticación**:

  - `@react-native-firebase/app`: ^18.7.3
  - `@react-native-firebase/auth`: ^18.7.3

- **Red y Datos**:
  - `axios`: ^1.6.7
  - `@react-native-community/netinfo`: ^11.2.1

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── hooks/              # Hooks personalizados
├── modules/            # Módulos principales de la aplicación
│   ├── auth/          # Autenticación (login/registro)
│   ├── home/          # Vista principal de categorías
│   ├── favorites/     # Gestión de favoritos
│   ├── search/        # Búsqueda de chistes
│   └── profile/       # Perfil de usuario
├── services/          # Servicios (API, auth, etc.)
└── store/             # Estados globales (Zustand)

app/                   # Rutas de la aplicación (Expo Router)
├── (app)/            # Rutas autenticadas
│   └── (tabs)/       # Navegación por tabs
└── _layout.tsx       # Layout principal
```

## Módulos Principales

### 1. Autenticación (`src/modules/auth/`)

- Login con email/contraseña
- Registro de nuevos usuarios
- Autenticación biométrica
- Persistencia de sesión
- Validaciones con Formik y Yup

### 2. Categorías (`src/modules/home/`)

- Lista de categorías de chistes
- Chistes aleatorios por categoría
- Interfaz de diálogo para mostrar chistes
- Opción para agregar a favoritos

### 3. Favoritos (`src/modules/favorites/`)

- Gestión de chistes favoritos
- Persistencia local con AsyncStorage
- Swipe para eliminar/compartir
- Pull-to-refresh para actualizar

### 4. Búsqueda (`src/modules/search/`)

- Búsqueda en tiempo real
- Debounce para optimizar llamadas
- Validación de términos de búsqueda
- Lista optimizada de resultados

### 5. Perfil (`src/modules/profile/`)

- Información del usuario
- Gestión de sesión
- Configuración de biometría
- Cierre de sesión

## Características Técnicas

### Gestión de Estado

- Zustand para estado global
- Stores modulares:
  - `useAuthStore`: Autenticación
  - `useErrorStore`: Manejo de errores
  - `useCategoriesStore`: Categorías y favoritos
  - `useNetworkStore`: Estado de conectividad

### Networking

- Axios para peticiones HTTP
- Interceptores para manejo de errores
- Validación de conectividad
- Caché de respuestas

### UI/UX

- Tema claro/oscuro
- SafeArea adaptativo
- Animaciones nativas
- Feedback táctil
- Indicadores de carga
- Manejo de errores visual

### Seguridad

- Autenticación Firebase
- Biometría local
- Encriptación de credenciales
- Validación de tokens

## Instalación y Ejecución

1. Clonar el repositorio:

```bash
git clone <repository-url>
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el proyecto:

```bash
npx expo start
```

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run android`: Ejecuta la app en Android
- `npm run ios`: Ejecuta la app en iOS
- `npm run web`: Ejecuta la versión web
- `npm run lint`: Ejecuta el linter
- `npm run test`: Ejecuta los tests

## Configuración de Desarrollo

1. Configurar variables de entorno:

   - Crear archivo `.env` basado en `.env.example`
   - Configurar credenciales de Firebase

2. Configurar Firebase:

   - Agregar `google-services.json` para Android
   - Agregar `GoogleService-Info.plist` para iOS

3. Configurar certificados de desarrollo:
   - Generar certificados para iOS
   - Configurar keystore para Android

## Consideraciones de Rendimiento

- Lazy loading de componentes pesados
- Memorización de callbacks y valores
- Optimización de re-renders
- Gestión eficiente de memoria
- Caché de imágenes y datos

## Contribución

1. Crear branch: `feature/nueva-funcionalidad`
2. Commit cambios: `git commit -m 'feat: nueva funcionalidad'`
3. Push al branch: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.
