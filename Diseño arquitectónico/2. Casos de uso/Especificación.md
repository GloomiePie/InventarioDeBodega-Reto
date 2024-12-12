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
## 1. Diagrama de caso de uso (Aprovisionamiento)

![Inventario de Bodega-Caso de Uso 1 drawio](https://github.com/user-attachments/assets/16200d1b-2f0f-48f2-82c3-3a7832055503)


 ## Descripción del primer caso de uso: Aprovisionamiento

 ### Caso: Solicitar Componentes 

| *Nombre*           | Solicitar Componentes                      |
|-----------------------|-------------------------------------------------|
| *Actores*          | Usuario (Comprador, Responsable de aprovisionamiento).    |
| *Flujo normal*     | 1. Usuario identifica los componentes necesarios según las políticas de inventario. <br>2. Usuario elabora los pedidos de los componentes requeridos.<br>3. Usuario controla las órdenes pendientes para garantizar entregas a tiempo. <br>4. Usuario confirma la recepción de los componentes solicitados.|

 ### Caso: Recibir Componentes

| *Nombre*           | Recibir Componentes                          |
|-----------------------|-------------------------------------------------|
| *Actores*          | - Usuario (Comprador, Responsable de aprovisionamiento).<br> - Inventario   |
| *Flujo normal*     | 1. Usuario verifica físicamente los componentes recibidos contra los pedidos realizados.<br>2. Usuario inspecciona los componentes para garantizar su calidad y cantidad.<br>3. Usuario registra las entradas de los componentes al Inventario.<br>4. Usuario reporta cualquier discrepancia o daño identificado.|

## 2. Diagrama de caso de uso (Almacenamiento)

![Inventario de Bodega-Caso de Uso 2](https://github.com/user-attachments/assets/9b1955ed-38bf-47ee-a909-547a3e15675e)

 ## Descripción del segundo caso de uso: Almacenamiento

 ### Caso: Organizar los Componentes 

| *Nombre*           | Organizar los Componentes                                    |
|-----------------------|-------------------------------------------------|
| *Actores*          | Encargado de almacén.     |
| *Flujo normal*     | 1. Encargado de almacén etiqueta y codifica los componentes para facilitar su identificación. <br>2. Encargado de almacén clasifica los componentes según el sistema de categorización definido.<br>3. Encargado de almacén organiza los componentes priorizando aquellos con mayor demanda o rotación. |
 
## 3. Diagrama de caso de uso (Gestión operativa)

![Inventario de Bodega-Caso de uso 3](https://github.com/user-attachments/assets/408f6562-dbdd-4f1c-9f1b-0903fc722a8d)

## Descripción del tercer caso de uso: Gestión operativa

### Caso: Monitorear las Existencias

| *Nombre*           | Monitorear las Existencias         |
|-----------------------|-------------------------------------------------|
| *Actores*          | Coordinador de operaciones de inventario    |
| *Flujo normal*     | 1. Coordinador de operaciones de inventario revisa los niveles actuales de existencias.<br>2. Coordinador de operaciones de inventario realiza auditorías regulares para verificar discrepancias.<br>3. Coordinador de operaciones de inventario actualiza los registros con los cambios identificados.<br>4. Coordinador de operaciones de inventario controla los componentes obsoletos o caducados.|

### Caso: Reabastecer los Componentes

| *Nombre*           | Reabastecer los Componentes         |
|-----------------------|-------------------------------------------------|
| *Actores*          | Coordinador de operaciones de inventario    |
| *Flujo normal*     | 1. Coordinador de operaciones de inventario identifica componentes que alcanzan el punto de reorden.<br>2. Coordinador de operaciones de inventario activa las órdenes de compra para reabastecer dichos componentes.<br>3. Coordinador de operaciones de inventario calcula el stock de seguridad necesario según la demanda actual.|
