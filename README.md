# Desafío Racional

## Uso de IA:

Para esta parte del desafío utilicé mucho más Claude de forma "hacky". Por lo que entendí, es más enfocado en la experiencia de usuario que en el código en sí. Además, el código que me aportó la IA es principalmente D3, no deberían haber problemas de seguridad o privacidad. De todas maneras, sé lo que hace el código y tuve que arreglar varias cosas que la IA no era capaz de hacer (como renderizar los datos según el modo en que se está utilizando "Retorno" o "Valor"), sólo que no lo revisé con tanta profundidad como lo haría con otros componentes más críticos.
La idea y forma de funcionamiento de cada funcionalidad fue sin IA (excepto el tooltip, que me lo agregó antes que se me ocurriera).
Lo único que me preocupa por el uso de IA en este componente es la eficiencia del uso de la librería, pero el tiempo de carga es relativamente bajo y una vez cargado el rendimiento es bueno.

## Cómo ejecutar el proyecto:

1. Clonar el repositorio.
2. Instalar las dependencias con `npm install`.
3. Configurar las variables de entorno necesarias en el archivo `.env`, usar `.env.example` como ejemplo.
4. Iniciar el servidor de desarrollo con `npm start`.
5. Abrir el navegador y navegar a `http://localhost:5147`.
