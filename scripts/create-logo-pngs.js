const fs = require('fs');
const path = require('path');

// Create a clean, minimal SVG logo design
const createLogoSVG = (size) => {
  const leafSize = size * 0.5;
  const centerX = size / 2;
  const centerY = size / 2;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="${centerX}" cy="${centerY}" r="${size/2}" fill="#386641"/>
  
  <!-- Leaf shape -->
  <path d="M${centerX} ${centerY - leafSize/3} 
           Q${centerX + leafSize/3} ${centerY - leafSize/4} ${centerX + leafSize/4} ${centerY + leafSize/4}
           Q${centerX + leafSize/6} ${centerY + leafSize/3} ${centerX} ${centerY + leafSize/2}
           Q${centerX - leafSize/6} ${centerY + leafSize/3} ${centerX - leafSize/4} ${centerY + leafSize/4}
           Q${centerX - leafSize/3} ${centerY - leafSize/4} ${centerX} ${centerY - leafSize/3}Z" 
        fill="#a7c957"/>
  
  <!-- Leaf vein -->
  <path d="M${centerX} ${centerY - leafSize/4} L${centerX} ${centerY + leafSize/3}" 
        stroke="#386641" stroke-width="${Math.max(1, size/64)}" stroke-linecap="round"/>
  
  <!-- Small side veins -->
  <path d="M${centerX - leafSize/8} ${centerY} L${centerX + leafSize/16} ${centerY - leafSize/16}" 
        stroke="#386641" stroke-width="${Math.max(1, size/96)}" stroke-linecap="round"/>
  <path d="M${centerX + leafSize/8} ${centerY} L${centerX - leafSize/16} ${centerY - leafSize/16}" 
        stroke="#386641" stroke-width="${Math.max(1, size/96)}" stroke-linecap="round"/>
</svg>`;
};

// Function to create HTML with inline SVG for conversion
const createHTMLForConversion = (svgContent, size) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; background: transparent; }
        #logo { width: ${size}px; height: ${size}px; }
    </style>
</head>
<body>
    <div id="logo">${svgContent}</div>
</body>
</html>
`;

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate logo files for PWA
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 Generating GardenGuardian AI logo files...\n');

sizes.forEach(size => {
  const svg = createLogoSVG(size);
  
  // Save SVG version
  fs.writeFileSync(path.join(publicDir, `icon-${size}.svg`), svg);
  
  // For now, we'll use the SVG as placeholder for PNG
  // In a real production environment, you'd use a tool like puppeteer to convert to PNG
  console.log(`✅ Generated icon-${size}.svg (${size}x${size})`);
});

// Generate favicon.ico content (SVG as fallback)
const faviconSVG = createLogoSVG(32);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG);

// Generate apple-touch-icon
const appleTouchSVG = createLogoSVG(180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), appleTouchSVG);

// Create a simple base64 encoded PNG-like data for favicon
const createSimpleFavicon = () => {
  // This creates a minimal 16x16 favicon data URL
  return `data:image/svg+xml;base64,${Buffer.from(createLogoSVG(16)).toString('base64')}`;
};

console.log('\n🎨 Logo generation complete!');
console.log('\nGenerated files:');
sizes.forEach(size => console.log(`  📁 icon-${size}.svg`));
console.log('  📁 favicon.svg');
console.log('  📁 apple-touch-icon.svg');

console.log('\n🔧 Next step: Update PWA manifest and HTML head...');

// Generate manifest content
const manifestContent = {
  "name": "GardenGuardian AI",
  "short_name": "GardenGuardian",
  "description": "Your AI-Powered Garden Health Detective",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f2e8cf",
  "theme_color": "#386641",
  "orientation": "portrait-primary",
  "icons": sizes.map(size => ({
    "src": `/icon-${size}.svg`,
    "sizes": `${size}x${size}`,
    "type": "image/svg+xml",
    "purpose": size >= 192 ? "any maskable" : "any"
  }))
};

fs.writeFileSync(
  path.join(publicDir, 'manifest.json'), 
  JSON.stringify(manifestContent, null, 2)
);

console.log('✅ Updated manifest.json');
console.log('\n🚀 Ready for PWA installation!'); 