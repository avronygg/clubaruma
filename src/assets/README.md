# src/assets

Reservado para assets que deban pasar por el bundler (SVG en línea, iconos,
tipografías de marca futuras).

Las **fotografías** no van aquí: los masters viven en `assets-source/` y sus
derivados responsive se generan en `public/images/` con `npm run images`.
Servirlas desde `public/` permite `srcset` con nombres estables y precarga del
LCP desde `index.html`.
