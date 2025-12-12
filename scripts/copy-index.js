const fs = require('fs');
const path = require('path');

const browserPath = path.join(__dirname, '../dist/ng-hub-ui-sortable-app/browser');
const indexPath = path.join(browserPath, 'index.html');

// Verificar si ya existe index.html (prerenderizado)
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Verificar si el index.html tiene contenido prerenderizado (app-root no vacío)
  const hasContent = indexContent.includes('<app-root>') &&
                     !indexContent.match(/<app-root>\s*<\/app-root>/);

  if (hasContent) {
    console.log('✅ Archivos HTML prerenderizados encontrados!');
    console.log('📌 El prerendering funcionó correctamente.');
    console.log('📌 Los archivos HTML ya contienen el contenido estático de cada ruta.');
    process.exit(0);
  }
}

// Si no hay prerender, copiar index.csr.html
const csrPath = path.join(browserPath, 'index.csr.html');

console.log('📝 No se encontró prerender, copiando index.csr.html a index.html...');

if (fs.existsSync(csrPath)) {
  fs.copyFileSync(csrPath, indexPath);
  console.log('✅ index.html creado exitosamente');

  // Crear index.html para cada ruta (para GitHub Pages)
  const routes = [
    '/sortable-array',
    '/sortable-form-array',
    '/custom-options',
    '/multiple-lists',
    '/layout-builder',
    '/sortable-signal'
  ];

  console.log('\n📁 Creando archivos HTML para cada ruta...');

  routes.forEach(route => {
    const routePath = path.join(browserPath, route.substring(1));

    if (!fs.existsSync(routePath)) {
      fs.mkdirSync(routePath, { recursive: true });
    }

    const routeIndexPath = path.join(routePath, 'index.html');
    fs.copyFileSync(csrPath, routeIndexPath);
    console.log(`✅ Creado: ${route}/index.html`);
  });

  console.log('\n🎉 Proceso completado exitosamente!');
  console.log('📌 Nota: Los meta tags se actualizarán dinámicamente en el cliente cuando se cargue cada ruta.');
} else {
  console.error('❌ Error: No se encontró index.csr.html ni archivos prerenderizados');
  process.exit(1);
}
