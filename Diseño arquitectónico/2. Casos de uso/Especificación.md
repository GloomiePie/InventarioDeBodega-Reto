<p align="right">
  <img src="https://i.postimg.cc/13qQdqZs/utpllogo.png" alt="Logo UTPL" width="150"/>
</p>


# Diagrama de casos de uso 

## ¿Qué es un diagrama de casos de uso?

Un diagrama de casos de uso es una representación gráfica empleada en el modelado de sistemas para describir las interacciones entre los actores (usuarios, sistemas externos u otros componentes) y las funcionalidades principales que ofrece un sistema. Este tipo de diagrama, basado en el estándar UML (Lenguaje Unificado de Modelado), se utiliza para documentar **qué hace el sistema** desde la perspectiva de los usuarios, sin entrar en detalles sobre **cómo se implementa**.

---

## ¿Para qué sirve un Diagrama de Casos de Uso?

El diagrama de casos de uso es una herramienta clave para el desarrollo y documentación de sistemas, ya que permite:

1. **Especificar requisitos funcionales**: Identificar y detallar las funcionalidades principales que debe cumplir el sistema.
2. **Facilitar la comunicación**: Servir como un medio común entre los interesados, desarrolladores y analistas para garantizar la comprensión de los requisitos.
3. **Definir el alcance del sistema**: Determinar los límites del sistema, especificando qué incluye y qué excluye.
4. **Identificar actores clave**: Describir quiénes interactuarán con el sistema, ya sean usuarios humanos o sistemas externos.
5. **Priorizar funcionalidades**: Ayudar a evaluar y clasificar las funcionalidades en función de su importancia o impacto para los usuarios.

---

## Estructura de un Diagrama de Casos de Uso

La estructura de un diagrama de casos de uso incluye los siguientes componentes principales:

1. **Actores**:
   - Representan las entidades externas que interactúan con el sistema.
   - Pueden ser personas, organizaciones o sistemas.
   - Se representan gráficamente como una figura humana o una etiqueta que los identifica.
   - Ejemplo: *Usuario*, *Administrador*, *Sistema Externo*.

2. **Casos de Uso**:
   - Representan las funcionalidades o servicios específicos que el sistema proporciona a los actores.
   - Se representan como óvalos con un nombre que describe la acción.
   - Ejemplo: *Registrar Usuario*, *Generar Informe*, *Procesar Pago*.

3. **Relaciones**:
   - **Asociación**: Representa la interacción entre un actor y un caso de uso (línea sólida).
   - **Inclusión** (`<<include>>`): Indica que un caso de uso incluye la funcionalidad de otro, generalmente para evitar redundancia.
   - **Extensión** (`<<extend>>`): Señala un caso de uso opcional que extiende la funcionalidad de otro principal, dependiendo de ciertas condiciones.
   - **Generalización**: Define relaciones de herencia entre actores o entre casos de uso.

4. **Sistema**:
   - Representa los límites del sistema modelado.
   - Se ilustra como un rectángulo que contiene los casos de uso.

---
## 1. Diagrama de caso de uso (Planificación del Inventario)

![Inventario de Bodega-Caso de Uso 1 drawio](https://github.com/user-attachments/assets/6f4a5a25-7169-4f94-80cf-fc6b68f12b8e)


## Descripción del caso del primer uso: Planificación del Inventario

### Caso: Definir los objetivos
| *Nombre*           | Definir los objetivos|
|-----------------------|-------------------------------------------------|
| *Actores*          | Gerente de inventarios. |
| *Flujo normal*     | 1. Gerente de inventarios analiza las necesidades de la organización.<br>2. Gerente de inventarios define la demanda del inventario basada en la proyección de necesidades.<br>3. Gerente de inventarios establece los niveles óptimos del inventario considerando la demanda.<br>4. Gerente de inventarios determina los recursos financieros y operativos requeridos para cumplir con los objetivos.|

### Caso: Establecer Políticas de Inventario
| *Nombre*           | Establecer Políticas de Inventario        |
|-----------------------|-------------------------------------------------|
| *Actores*          | Gerente de inventarios.   |
| *Flujo normal*     | 1. Gerente de inventarios selecciona la estrategia más adecuada (FIFO, LIFO, JIT).<br>2. Gerente de inventarios define los parámetros de seguridad del stock para evitar rupturas.<br>3. Gerente de inventarios establece las políticas de reabastecimiento, incluyendo periodicidad y puntos de reorden.|

### Caso: Clasificar los Productos
| *Nombre*           | Clasificar los Componentes       |
|-----------------------|-------------------------------------------------|
| *Actores*          | Gerente de inventarios.   |
| *Flujo normal*     | 1. Gerente de inventarios realiza el análisis ABC para clasificar los componentes según su valor y demanda.<br>2. Gerente de inventarios identifica los componentes críticos que requieren atención prioritaria.<br>3. Responsable de inventarios categoriza los componentes según su rotación (alta, media, baja).|


## 2. Diagrama de caso de uso (Aprovisionamiento)
![Inventario de Bodega-Caso de Uso 2 drawio](https://github.com/user-attachments/assets/f6040192-3efa-4673-bfd5-0a3afd76bb5d)

 ## Descripción del segundo caso de uso: Aprovisionamiento

 ### Caso: Seleccionar Proveedores

| *Nombre*           | Seleccionar Proveedores                          |
|-----------------------|-------------------------------------------------|
| *Actores*          | Usuario (Comprador, Responsable de aprovisionamiento).     |
| *Flujo normal*     | 1. Usuario investiga las opciones de proveedores disponibles. <br>2. Usuario evalúa a los proveedores según criterios de calidad, precio y cumplimiento.<br>3. Usuario negocia contratos con los proveedores seleccionados. <br>4. Usuarios homologa los proveedores aprobados para formalizar su relación comercial.|

 ### Caso: Solicitar los Materiales 

| *Nombre*           | Solicitar los Materiales                          |
|-----------------------|-------------------------------------------------|
| *Actores*          | Usuario (Comprador, Responsable de aprovisionamiento).    |
| *Flujo normal*     | 1. Usuario identifica los materiales necesarios según las políticas de inventario. <br>2. Usuario elabora los pedidos de los materiales requeridos.<br>3. Usuario controla las órdenes pendientes para garantizar entregas a tiempo. <br>4. Usuario confirma la recepción de los materiales solicitados.|

 ### Caso: Recibir los Materiales 

| *Nombre*           | Recibir los Materiales                          |
|-----------------------|-------------------------------------------------|
| *Actores*          | Usuario (Comprador, Responsable de aprovisionamiento).     |
| *Flujo normal*     | 1. Usuario verifica físicamente los materiales recibidos contra los pedidos realizados.<br>2. Usuario inspecciona los bienes para garantizar su calidad y cantidad.<br>3. Usuario registra las entradas de los bienes al inventario.<br>4. Usuario reporta cualquier discrepancia o daño identificado.|

## 3. Diagrama de caso de uso (Almacenamiento)

![Inventario de Bodega-Caso de Uso 3 drawio](https://github.com/user-attachments/assets/e6014ee9-b27a-4978-b688-44ff9d7993f9)

 ## Descripción del tercer caso de uso: Almacenamiento

 ### Caso:Diseñar el Almacén

| *Nombre*           | Diseñar el Almacén                         |
|-----------------------|-------------------------------------------------|
| *Actores*          | Encargado de almacén.     |
| *Flujo normal*     | 1. Encargado de almacén analiza el espacio disponible en el almacén.<br>2. Encargado de almacén optimiza el diseño del espacio para maximizar la capacidad.<br>3. Encargado de almacén diseña los flujos logísticos para facilitar el acceso y la distribución.<br>4. Encargado de almacén define las ubicaciones específicas para almacenar cada tipo de componente.|

 ### Caso: Organizar los Productos 

| *Nombre*           | Organizar los Productos                                     |
|-----------------------|-------------------------------------------------|
| *Actores*          | Encargado de almacén.     |
| *Flujo normal*     | 1. Encargado de almacén etiqueta y codifica los productos para facilitar su identificación. <br>2. Encargado de almacén clasifica los productos según el sistema de categorización definido.<br>3. Encargado de almacén organiza los productos priorizando aquellos con mayor demanda o rotación. |


 ### Caso: Controlar las Condiciones del Almacén

| *Nombre*           | Controlar las Condiciones del Almacén                               |
|-----------------------|-------------------------------------------------|
| *Actores*          | Encargado de almacén.    |
| *Flujo normal*     | 1. Responsable de almacén monitorea la temperatura y la humedad para garantizar condiciones adecuadas. <br>2. Responsable de almacén supervisa las medidas de seguridad contra robos, incendios u otros riesgos.<br>3. Responsable de almacén realiza inspecciones periódicas para identificar y corregir posibles problemas. |
 
## 4. Diagrama de caso de uso (Gestión operativa)
![Inventario de Bodega-Caso de uso 4 drawio](https://github.com/user-attachments/assets/015fed12-152a-447e-aeaa-a72307b126b2)


## Descripción del tercer caso de uso: Gestión operativa

### Caso: Ingresar Usuario

| *Nombre*           | Ingresar Usuario                    |
|-----------------------|-------------------------------------------------|
| *Actores*          | Personal administrativo.<br>- BD UTPL.   |
| *Flujo normal*     | 1. El personal administrativo ingresa sus credenciales a BD UTPL. <br>2. BD UTPL valida las credenciales del personal administrativo. |


### Caso: Monitorear las Existencias

| *Nombre*           | Monitorear las Existencias         |
|-----------------------|-------------------------------------------------|
| *Actores*          | Coordinador de operaciones de inventario    |
| *Flujo normal*     | 1. Coordinador de operaciones de inventario revisa los niveles actuales de existencias.<br>2. Coordinador de operaciones de inventario revisa los niveles actuales de existencias.<br>3. Coordinador de operaciones de inventario realiza auditorías regulares para verificar discrepancias.<br>4. Coordinador de operaciones de inventario actualiza los registros con los cambios identificados.<br>5. Coordinador de operaciones de inventario controla los productos obsoletos o caducados.|

### Caso: Reabastecer los Componentes

| *Nombre*           | Reabastecer los Componentes         |
|-----------------------|-------------------------------------------------|
| *Actores*          | Coordinador de operaciones de inventario    |
| *Flujo normal*     | 1. Coordinador de operaciones de inventario identifica productos que alcanzan el punto de reorden.<br>2. Coordinador de operaciones de inventario activa las órdenes de compra para reabastecer dichos productos.<br>3. Coordinador de operaciones de inventario calcula el stock de seguridad necesario según la demanda actual.|

### Caso: Gestionar las Discrepancias

| *Nombre*           | Gestionar las Discrepancias         |
|-----------------------|-------------------------------------------------|
| *Actores*          | Coordinador de operaciones de inventario    |
| *Flujo normal*     | 1. Coordinador de operaciones de inventario detecta faltantes, excedentes o daños en los productos.<br>2. Coordinador de operaciones de inventario analiza las causas de las discrepancias.<br>3. Coordinador de operaciones de inventario implementa soluciones correctivas, como ajustes en pedidos o devoluciones.|

## 5. Diagrama de caso de uso (Análisis y mejora continua)
![Inventario de Bodega-Caso de uso 5 drawio](https://github.com/user-attachments/assets/a4df9576-b718-44ae-8a88-cdda5e209845)

## Descripción del tercer caso de uso: Análisis y mejora continua

### Caso: Evaluar el Desempeño

| *Nombre*           | Evaluar el Desempeño        |
|-----------------------|-------------------------------------------------|
| *Actores*          | Usuario(Analista de inventario, Gerente de mejora contiuna)    |
| *Flujo normal*     | 1. Usuario recolecta datos sobre el desempeño del inventario.<br>2. Usuario calcula indicadores clave como rotación, exactitud y tiempos de reabastecimiento.<br>3. Usuario compara los resultados obtenidos con las metas establecidas.|


### Caso: Optimizar los Procesos

| *Nombre*           | Optimizar los Procesos       |
|-----------------------|-------------------------------------------------|
| *Actores*          | Usuario(Analista de inventario, Gerente de mejora contiuna)    |
| *Flujo normal*     | 1. Usuario identifica áreas de oportunidad para optimización.<br>2. Usuario continua implementa tecnologías o metodologías para mejorar los procesos.<br>3. Usuario capacita al personal en las nuevas prácticas implementadas.|

### Caso: Documentar y Retroalimentar el Proceso

| *Nombre*           | Documentar y Retroalimentar el Proceso       |
|-----------------------|-------------------------------------------------|
| *Actores*          | Usuario(Analista de inventario, Gerente de mejora contiuna)    |
| *Flujo normal*     | 1. Usuario registra las lecciones aprendidas durante el ciclo operativo.<br>2. Usuario desarrolla informes con recomendaciones específicas.<br>3. Usuario implementa ajustes basados en las observaciones del análisis.|
