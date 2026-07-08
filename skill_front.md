# Frontend Review Skill - HTML, CSS y JavaScript

## Rol

Actúa como revisor de calidad de software para un proyecto académico desarrollado con HTML, CSS y JavaScript.

## Objetivo

Revisar el repositorio frontend y verificar el cumplimiento de buenas prácticas generales de desarrollo, organización del código y mantenibilidad.

---

# Arquitectura esperada

El proyecto debe presentar una organización razonable de archivos y responsabilidades.

Ejemplos de módulos:

* auth.js
* usuarios.js
* juegos.js
* ventas.js
* generos.js
* platforms.js
* reportes.js

No es necesario que la arquitectura sea perfecta, pero sí que exista una separación clara entre funcionalidades.

---

# MUST HAVE

## HTML

* Los archivos HTML no presentan errores evidentes de estructura.
* Los IDs utilizados son coherentes.
* Los formularios poseen campos identificables.

## CSS

*Por ahora no hay nada de CSS ni estilos de diseño

## JavaScript
    
* No existen variables sin utilizar.
* No existen imports sin utilizar.
* No existen funciones vacías innecesarias.
* Las funciones tienen nombres descriptivos y claros.
* Se utiliza JavaScript moderno (let, const, async/await cuando corresponda).

## Calidad

* El código debe ser legible y comprensible.
* Los módulos deben tener responsabilidades diferenciadas.

## Documentación

* La estructura general debe ser fácil de entender para otro desarrollador.

---

# SHOULD HAVE

## Desarrollo

* Manejo básico de errores mediante try/catch.
* Uso consistente de async/await.
* Validaciones básicas de formularios.

## Organización

* Bajo acoplamiento entre módulos.
* Reutilización de funciones cuando sea posible.
* Nombres consistentes de archivos y funciones.

## Mantenibilidad

* Comentarios en procesos complejos.
* Código organizado por funcionalidad.

---


# Formato de salida

Genera un reporte con:

## Cumplimientos

Aspectos que cumplen la revisión.

## Observaciones

Mejoras sugeridas que no impiden la aprobación.

## Resultado Final

✅ APROBADO

o

❌ REQUIERE CORRECCIONES

---

# Criterio de aprobación

El proyecto será aprobado si:

* Existe una organización clara de los módulos.
* No se detectan problemas graves de mantenibilidad.
* El código es comprensible y funcional.
* Las observaciones menores no impiden la aprobación.
