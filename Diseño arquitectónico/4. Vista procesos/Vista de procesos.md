<p align="right">
  <img src="https://i.postimg.cc/13qQdqZs/utpllogo.png" alt="Logo UTPL" width="150"/>
</p>

# Diagramas de Secuencia

## ¿Qué son los diagramas de secuencia?
Los diagramas de secuencia son una herramienta de modelado en la Ingeniería de Software que forma parte del Lenguaje Unificado de Modelado (UML). Se utilizan para describir cómo los objetos de un sistema interactúan entre sí a través del tiempo, mostrando el flujo de mensajes o llamadas entre ellos. Estos diagramas son especialmente útiles para representar procesos y casos de uso en sistemas orientados a objetos.

## Estructura que siguen los diagramas de secuencia
1. **Actores y Objetos**: Representan las entidades que participan en la interacción. Los actores se representan como figuras humanas, y los objetos como rectángulos.
2. **Líneas de vida**: Indican la existencia de un actor u objeto durante el proceso. Son líneas verticales que comienzan debajo de cada actor u objeto.
3. **Mensajes**: Representan la comunicación entre actores y objetos mediante flechas horizontales.
4. **Bloques de ejecución**: Rectángulos sobre las líneas de vida que representan la ejecución de un proceso o método.
5. **Tiempo**: Se representa de forma implícita en la dirección descendente del diagrama.

## Diagramas de secuencia

### Diagrama 1: Aprovisionamiento
![Inventario de Bodega-Diagrama de secuencia 1 drawio](https://github.com/user-attachments/assets/c1edc20c-b91e-436c-b8f2-6c6be12d4827)



**Explicación**:  
Este diagrama describe cómo el **Personal Administrativo** inicia sesión en el sistema de la UTPL. Una vez autenticado, puede agregar componentes al inventario tras validar su existencia. Los pasos clave incluyen:  
- Verificar credenciales.  
- Obtener los datos del usuario.  
- Agregar componentes tras verificar su disponibilidad.

---


### Diagrama 2: Almacenamiento
![Inventario de Bodega-Diagrama de secuencia 2 drawio](https://github.com/user-attachments/assets/52dcd13f-cc53-4325-b53b-c3f22d20648b)




**Explicación**:  
Este diagrama muestra el proceso de verificación y clasificación de componentes. El flujo incluye:  
- Verificar si un componente existe en el inventario.  
- Verificar el estado del componente.  
- Clasificar los componentes en diferentes categorías basadas en su tipo.

---


### Diagrama 3: Gestión operativa
![Inventario de Bodega-Diagrama de secuencia 3 drawio](https://github.com/user-attachments/assets/0a2eac5c-e12e-4d5a-b1fe-4af5116d16d7)





**Explicación**:  
Aquí se describe el proceso de monitoreo de movimientos e irregularidades en el inventario, incluyendo la generación de alertas y registros. Las acciones clave son:  
- Monitorear movimientos.  
- Generar informes de irregularidades.  
- Registrar movimientos específicos y enviar alertas al sistema.

---


# Diagramas de Robustez  

## ¿Qué son los diagramas de robustez?  
Los diagramas de robustez son una herramienta de modelado utilizada en el diseño de software para detallar cómo los actores, objetos, y procesos interactúan dentro de un sistema. Sirven como un puente entre los diagramas de casos de uso y los diagramas de diseño detallado, permitiendo identificar elementos clave del sistema como actores, controladores y entidades.  

## Estructura que siguen los diagramas de robustez  

- *Actores:* Representan los usuarios u otros sistemas que interactúan con el sistema principal. Se dibujan como figuras humanas o íconos.  
- *Entidades:* Son los elementos de datos o conceptos principales del dominio, representados como rectángulos.  
- *Controladores:* Representan la lógica de la aplicación y la interacción entre actores y entidades. Se muestran como círculos u óvalos.  
- *Relaciones:* Representan las conexiones entre actores, controladores y entidades mediante líneas con etiquetas que describen la interacción.

## Diagramas de robustez

### Diagrama 1: Aprovisionamiento
![Inventario de Bodega-Diagrama de robustez 1 drawio](https://github.com/user-attachments/assets/62ce5534-b5ef-4ac9-b71d-daedec34edad)



### Diagrama 2: Almacenamiento
![Inventario de Bodega-Diagrama de robustez 2 drawio](https://github.com/user-attachments/assets/2a9b153b-42b2-4ee8-9c59-5a76540e7bca)



### Diagrama 3: Gestión operativa
![Inventario de Bodega-Diagrama de robustez 3 drawio](https://github.com/user-attachments/assets/85673d76-401f-4fcc-98b6-f56383a36529)





