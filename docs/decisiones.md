# Decisiones de diseño e ingeniería

Registro de por qué cada cosa está como está. Si algo parece raro, probablemente
esté explicado aquí.

---

## El logotipo se usa como máscara CSS, no como imagen

**Contexto** — La marca necesita el wordmark en blanco, en rojo y en negro según
el fondo. El cliente entregó un único PNG blanco con transparencia, y el encargo
era explícito: no redibujar el logo, no deformarlo, no añadirle efectos.

**Decisión** — El PNG se usa como `mask-image` y el color sale de
`currentColor`. Una sola clase (`logo-mask`) y un solo archivo sirven las tres
versiones. La proporción se fija con `aspect-ratio` a partir de las dimensiones
originales del archivo.

**Consecuencia** — Imposible deformar el logo o desincronizar variantes, y no
hay que mantener tres archivos. A cambio se depende de `mask-image`, con soporte
universal en navegadores actuales.

---

## El wordmark no aparece en el hero

**Contexto** — La fotografía del hero muestra un vaso con el logotipo ARUMA CLUB
grabado. Al colocar además el wordmark encima, se veían dos veces: en escritorio
llegaban a tocarse y se leía «ARUMAARUMA».

Se probaron tres salidas: reencuadrar la foto para sacar el vaso del plano
(descartada, el cliente quería la entrega íntegra), escalar mucho el wordmark
para que dominase por tamaño (funcionaba en escritorio, no en móvil), y oscurecer
la zona del vaso (apagaba la mejor parte de la foto).

**Decisión** — El hero no lleva wordmark. La marca la sostienen el logotipo de la
navbar, el grabado del propio vaso y el cierre de la página. El titular real es
la frase. El nombre sigue en el `h1` para lectores de pantalla y buscadores,
aunque no se pinte.

**Consecuencia** — Cero duplicación en cualquier tamaño, y el hero gana altura
para el mensaje de prelanzamiento. Es además lo que hacía la referencia del
propio cliente.

---

## Los huecos de fotografía se declaran, no se disimulan

**Contexto** — Solo existe una fotografía real. Una primera versión rellenó las
demás secciones con recortes de ese mismo negativo. El cliente lo rechazó: no
quería la misma foto repetida.

**Decisión** — Todo lo que no sea el hero es un marcador declarado en pantalla,
con su etiqueta, su proporción y el briefing para quien haga la producción. Se
compone con el mismo lenguaje que el resto —negro, filete, versalitas, un acento
rojo— y una trama diagonal finísima hecha con `repeating-linear-gradient`.

**Consecuencia** — La maqueta se puede enseñar sin explicaciones y el fotógrafo
recibe el encargo dentro del propio diseño. A cambio, hoy hay trece marcos
vacíos: la página se verá muy distinta cuando llegue el material.

---

## Dirección de arte por dispositivo, con corte en 1024px

**Contexto** — El cliente entregó dos encuadres del mismo plano: uno horizontal y
uno vertical. No es el mismo archivo recortado por CSS, son dos composiciones.

**Decisión** — `<picture>` con `media` sirve el horizontal a partir de 1024px y
el vertical por debajo.

El corte está en 1024px y no en el habitual 768px por una razón concreta: en un
tablet en vertical (768×1024) el encuadre horizontal perdería más de la mitad del
plano al recortarse con `object-cover`, mientras que el vertical aguanta bien.

**Consecuencia** — Cada dispositivo recibe una composición pensada para él y solo
descarga la que va a usar. El coste es mantener dos juegos de derivados.

---

## El cristal se parametriza con propiedades registradas

**Contexto** — La navbar de cristal tiene dos estados: en reposo sobre el hero y
asentada al bajar. El primer intento fueron dos utilidades, `glass` y
`glass-settled`, cada una declarando sus propiedades. No funcionó: ambas tienen
la misma especificidad, así que ganaba la que Tailwind ordenase última y el
estado asentado nunca se aplicaba.

**Decisión** — Los cuatro parámetros del cristal —fondo, borde, desenfoque y
saturación— son propiedades personalizadas registradas con `@property`. `glass`
las consume; `glass-settled` solo las redefine.

**Consecuencia** — Dos beneficios de golpe. El orden de las utilidades deja de
importar, porque ya no compiten. Y al estar registradas con tipo, el navegador
sabe interpolarlas: el cambio de estado se anima en lugar de saltar, algo que con
variables sin registrar no ocurre.

---

## No se declara `-webkit-backdrop-filter` a mano

**Contexto** — El cristal se escribió con la propiedad estándar y su versión
prefijada, por costumbre. El resultado fue que **no desenfocaba nada**: Lightning
CSS colapsaba ambas declaraciones y emitía solo la prefijada, que Chrome ya no
reconoce.

**Decisión** — Se declara únicamente `backdrop-filter`. El prefijado lo resuelve
la herramienta, que ahora emite las dos formas correctamente.

**Consecuencia** — El cristal funciona en todos los navegadores objetivo. La
lección general: en este proyecto los prefijos son cosa del pipeline, no del
código fuente.

Se dejó además un bloque `@supports` que devuelve el cristal a un fondo sólido
donde no haya `backdrop-filter`, para no perder legibilidad sobre la fotografía.

---

## La navbar se transforma con CSS, no con JavaScript

**Contexto** — El menú móvil no debía aparecer _encima_ de la cabecera, sino ser
la cabecera transformada: la píldora crece hasta ocupar la pantalla y su radio
pasa de cápsula a esquina blanda.

La primera versión animaba la altura con Motion. Obligaba a fijar un valor
numérico y rompía la responsividad, porque la altura de la píldora cambia por
breakpoint.

**Decisión** — La morfología se hace con una transición CSS sobre `height` y
`border-radius`, alternando clases.

**Consecuencia** — Los valores siguen siendo responsive y el bloque global de
`prefers-reduced-motion` la neutraliza sin escribir código extra. Animar `height`
provoca layout, pero se trata de un único elemento fijo y aislado: el coste es
irrelevante y a cambio se gana el efecto pedido.

---

## `LazyMotion` en modo estricto

**Contexto** — La librería de animación completa pesaba 47 kB comprimidos, la
pieza más grande del bundle después de React.

**Decisión** — `LazyMotion` con `domAnimation`, que trae animaciones, variants,
salidas y gestos, pero deja fuera drag y layout animations, que el proyecto no
usa. El modo `strict` obliga a escribir `<m.div>` en lugar de `<motion.div>`.

**Consecuencia** — 47 kB bajan a 34 kB. El `strict` es lo que hace efectivo el
recorte: sin él, un `<motion.div>` despistado volvería a arrastrar la librería
entera. El coste es recordar la convención.

---

## El formulario avisa de que no está conectado

**Contexto** — Captar la lista de espera es el objetivo de la web, pero no hay
backend. Un formulario que responde «estás en la lista» sin guardar nada engaña a
quien lo rellena.

**Decisión** — `submitWaitlist` devuelve `'unconfigured'` cuando no hay
`VITE_WAITLIST_ENDPOINT`. La interfaz lo dice en pantalla, en su propia línea y
en rojo. El aviso desaparece solo al configurar la variable.

**Consecuencia** — La maqueta se puede enseñar y probar sin mentir a nadie, y el
paso pendiente queda visible en lugar de enterrado en un `TODO`. En cuanto se
apunta a un servicio real, la web funciona sin tocar código.

---

## La paleta de Tailwind está vaciada

**Contexto** — El encargo insistía en que el rojo es un acento y el negro domina.
Es fácil que eso se erosione con el tiempo, un `bg-slate-800` cada vez.

**Decisión** — `--color-*: initial` borra la paleta por defecto de Tailwind y
solo se redefinen los colores de marca.

**Consecuencia** — `bg-blue-500` sencillamente no existe. La disciplina de color
deja de depender de la revisión y pasa a estar garantizada por la herramienta.
El CSS resultante es además más pequeño.
