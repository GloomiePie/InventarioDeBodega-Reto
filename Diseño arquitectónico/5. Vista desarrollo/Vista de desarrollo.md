<p align="right">
  <img src="https://i.postimg.cc/13qQdqZs/utpllogo.png" alt="Logo UTPL" width="150"/>
</p>

# CI/CD y DevOps

## ¿Qué es CI/CD?

CI/CD, que significa **Integración Continua y Entrega/Despliegue Continuo**, es un conjunto de prácticas que automatizan las etapas de desarrollo, prueba y despliegue del software. Su objetivo principal es mejorar la velocidad, calidad y confiabilidad de las entregas de software.

- **Integración Continua (CI)**: 
  - Es el proceso de integrar regularmente el código de diferentes desarrolladores en un repositorio compartido.
  - Incluye la ejecución automática de pruebas para identificar errores rápidamente.

- **Entrega Continua (CD - Continuous Delivery)**:
  - Extiende la CI al automatizar la preparación de entregas del software en cualquier momento.
  - Garantiza que el código esté siempre en un estado listo para producción.
  - Requiere pruebas adicionales y validaciones antes del despliegue.

- **Despliegue Continuo (CD - Continuous Deployment)**:
  - Va un paso más allá y automatiza también el proceso de despliegue en producción.
  - Cada cambio que pasa las pruebas se despliega automáticamente.

El enfoque CI/CD fomenta ciclos de desarrollo cortos, iterativos y más seguros.

---

## ¿Qué es DevOps?

**DevOps** es una cultura, metodología y conjunto de prácticas que busca integrar los equipos de desarrollo (Development) y operaciones (Operations) para mejorar la colaboración, automatización y entrega continua de software. DevOps no es solo una herramienta, sino una filosofía que combina personas, procesos y tecnologías.

- **Beneficios de DevOps**:
  - Ciclos de entrega más rápidos.
  - Mayor estabilidad y calidad del software.
  - Mejor alineación entre objetivos técnicos y empresariales.

## Foto del Pipeline

![pipeline devops](https://github.com/user-attachments/assets/c0eb0b47-f08d-4847-bc77-46f256dc54bc)

## Tabla de descripción 

| **Fase**     | **Plataformas**    | **Descripción**                                                                                                                                                              |
|--------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Plan**     | GitHub             | Se utilizará para gestionar el desarrollo colaborativo, organizar tareas mediante branches                                                                                |
|              | Trello             | Se empleará para el seguimiento de tareas y actualizaciones del estado de los incidentes detectados.                                                                      |
| **Code**     | React              | Será empleado para desarrollar la interfaz móvil, garantizando una experiencia de usuario eficiente                                                                        |
|              | Node.Js            | Se utiliza Node.js para escribir el código del backend, aprovechando su capacidad para manejar múltiples conexiones simultáneas y su ecosistema de módulos para integrar funcionalidades necesarias en el proyecto. |
| **Build**    | GitHub Actions     | Se utilizará para la automatización del testeo de cada parte del código                                                                                                   |
|              | Fastify            | Su arquitectura modular facilita la integración de diferentes componentes del sistema.                                                                                    |
| **Test**     | Firebase TestLab   | Permite realizar pruebas unitarias y de integración, asegurando que las funciones del backend interactúan correctamente con Firestore y que los datos se gestionan adecuadamente en el sistema de inventario. |
|              | JUnit              | Se utilizará para realizar pruebas unitarias automatizadas                                                                                                                |
| **Release**  | Fastify            | Permite preparar la aplicación para su lanzamiento mediante la configuración de rutas y middleware, asegurando que todos los endpoints estén listos para ser utilizados en producción |
| **Deploy**   | Firebase Hosting   | Permite implementar el backend sin preocuparse por la infraestructura subyacente, asegurando una alta disponibilidad y escalabilidad del sistema de gestión de inventario  |
|              | Cloud Functions    |  Permite implementar el backend sin preocuparse por la infraestructura subyacente, asegurando una alta disponibilidad y escalabilidad del sistema de gestión de inventario  |
|              | Google Play Store  | Se utilizará como plataforma para publicar y distribuir la aplicación móvil                                                                                              |
| **Operate**  | WSO2               | Ayudará a gestionar, publicar, monitorear y asegurar APIs, facilitando el control y la gobernanza de interfaces de comunicación.                                          |
| **Monitor**  | Discord            | Se utilizará para la comunicación en tiempo real y notificaciones de eventos relevantes                                                                                  |

## Cronograma de actividades de desarrollo BackEnd y FrontEnd

## Backend

### 1. Requerimientos y diseño

- **Análisis de requisitos**: Identificar las funcionalidades necesarias del sistema.
- **Diseño de la arquitectura**: Seleccionar la estructura del backend (microservicios, monolito).
- **Definición de modelos de datos**: Diseñar las bases de datos y las relaciones.
- **Definición de la API**: Crear un contrato API (endpoints, métodos, formatos).

### 2. Configuración inicial

- Configuración del entorno de desarrollo (IDE, dependencias, frameworks).
- Creación de repositorios (Git, CI/CD pipelines).
- Configuración del entorno de Cloud Functions.
- Configuración de la base de datos (Firebase).

### 3. Desarrollo

- **Implementación de modelos y esquemas de base de datos**.
- Desarrollo de endpoints:
  - Autenticación y autorización (registro, inicio de sesión).
  - Operaciones CRUD (Create, Read, Update, Delete).
  - Integraciones externas (APIs de terceros, servicios de pago).
- Implementación de lógica de negocio.
- Manejo de errores y validación de datos.

### 4. Pruebas y validación

- Creación de pruebas unitarias para servicios.
- Pruebas de integración con la base de datos.
- Pruebas de rendimiento y escalabilidad.
- Validación de seguridad.

### 5. Implementación y despliegue

- Preparación de la base de datos.
- Despliegue en producción.
- Configuración de monitoreo y logs.

---

## Frontend

### 1. Requerimientos y diseño

- **Análisis de requisitos**: Definir la experiencia del usuario (UX).
- **Wireframes y prototipos**: Crear bocetos visuales y prototipos interactivos.
- **Definición de arquitectura**: Estructura de componentes, rutas y estados.

### 2. Configuración inicial

- Configuración del entorno de desarrollo.
- Instalación de dependencias y configuración de herramientas.
- Configuración del diseño base.

### 3. Desarrollo

- Creación de componentes base.
- Implementación de rutas y navegación.
- Integración con APIs del backend.
- Desarrollo de lógica de estado.
- Estilizado y responsividad.

### 4. Pruebas y validación

- Pruebas unitarias de componentes.
- Pruebas funcionales y de interacción.
- Validación de diseño responsivo y accesibilidad.
- Pruebas de rendimiento en el navegador.

### 5. Implementación y despliegue

- Construcción del proyecto para producción.
- Despliegue en Google Play.
- Validación en entornos reales.
- Configuración de monitoreo.

---

## Cronograma de Actividades

### Backend

1. **Diseñar los modelos de datos y endpoints**  
   - Fecha inicio: 27/11/2024  
   - Fecha finalización: 04/12/2024

2. **Implementar el endpoint de autenticación**  
   - Fecha inicio: 11/12/2024  
   - Fecha finalización: 18/12/2024

3. **Crear lógica de negocio para los flujos principales**  
   - Fecha inicio: 20/12/2024  
   - Fecha finalización: 02/01/2025

4. **Integrar servicios externos**  
   - Fecha inicio: 02/01/2025  
   - Fecha finalización: 09/01/2025

5. **Probar y validar la seguridad**  
   - Fecha inicio: 09/01/2025  
   - Fecha finalización: 16/01/2025

### Frontend

1. **Crear componentes clave como formularios y dashboards**  
   - Fecha inicio: 04/12/2024  
   - Fecha finalización: 10/12/2024

2. **Implementar autenticación y manejo de sesiones**  
   - Fecha inicio: 11/12/2024  
   - Fecha finalización: 18/12/2024

3. **Integrar APIs y validar datos del backend**  
   - Fecha inicio: 02/01/2025  
   - Fecha finalización: 09/01/2025

4. **Asegurar la responsividad y accesibilidad**  
   - Fecha inicio: 16/01/2025  
   - Fecha finalización: 20/01/2025

5. **Realizar pruebas funcionales y visuales**  
   - Fecha inicio: 20/01/2025  
   - Fecha finalización: 23/01/2025
