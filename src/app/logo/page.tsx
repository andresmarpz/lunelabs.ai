'use client';

import { useState, useMemo } from 'react';

interface Dot {
  x: number;
  y: number;
  color: string;
}

export default function CircleOfDotsGenerator() {
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(500);
  const [dotSize, setDotSize] = useState(10);
  const [dotSpacing, setDotSpacing] = useState(5);
  const [dotColor, setDotColor] = useState('#000000');
  
  // Tool mode and painting state
  const [toolMode, setToolMode] = useState<'generate' | 'paint'>('generate');
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [isPainting, setIsPainting] = useState(false);
  const [dotColors, setDotColors] = useState<Map<string, string>>(new Map());
  const [showWarning, setShowWarning] = useState(false);
  const [pendingChange, setPendingChange] = useState<{ type: string; value: number } | null>(null);

  // Export settings
  const [exportWidth, setExportWidth] = useState(500);
  const [exportHeight, setExportHeight] = useState(500);
  const [exportMode, setExportMode] = useState<'social' | 'icon' | 'web' | 'print' | 'custom'>('custom');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  
  // Background and padding settings
  const [useBackground, setUseBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [exportPadding, setExportPadding] = useState(15); // percentage
  const [exportFormat, setExportFormat] = useState<'svg' | 'png'>('png');

  const dots = useMemo(() => {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = Math.min(canvasWidth, canvasHeight) / 2 - dotSize / 2;
    
    const dots: Dot[] = [];
    const step = dotSize + dotSpacing;
    
    // Calculate how many dots can fit in each direction
    const maxDotsX = Math.floor((canvasWidth - dotSize) / step) + 1;
    const maxDotsY = Math.floor((canvasHeight - dotSize) / step) + 1;
    
    // Calculate starting positions to center the grid
    const gridWidth = (maxDotsX - 1) * step;
    const gridHeight = (maxDotsY - 1) * step;
    const startX = centerX - gridWidth / 2;
    const startY = centerY - gridHeight / 2;
    
    // Create a grid of dots centered on the canvas
    for (let i = 0; i < maxDotsX; i++) {
      for (let j = 0; j < maxDotsY; j++) {
        const x = startX + i * step;
        const y = startY + j * step;
        
        // Skip dots that would be outside canvas bounds
        if (x < dotSize / 2 || x > canvasWidth - dotSize / 2 || 
            y < dotSize / 2 || y > canvasHeight - dotSize / 2) {
          continue;
        }
        
        const dx = x - centerX;
        const dy = y - centerY;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        
        // Use a slightly more permissive radius for cross-favored shape
        // Add extra tolerance for dots that are close to axes
        const isNearAxis = Math.abs(dx) < step * 0.4 || Math.abs(dy) < step * 0.4;
        const effectiveRadius = isNearAxis ? radius + step * 0.25 : radius;
        
        if (distanceFromCenter <= effectiveRadius) {
          const dotKey = `${i}-${j}`;
          const color = dotColors.get(dotKey) || dotColor;
          dots.push({ x, y, color });
        }
      }
    }
    
    return dots;
  }, [canvasWidth, canvasHeight, dotSize, dotSpacing, dotColors, dotColor]);

  // Dot hit detection function
  const findDotAtPosition = (mouseX: number, mouseY: number) => {
    const step = dotSize + dotSpacing;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const maxDotsX = Math.floor((canvasWidth - dotSize) / step) + 1;
    const maxDotsY = Math.floor((canvasHeight - dotSize) / step) + 1;
    const gridWidth = (maxDotsX - 1) * step;
    const gridHeight = (maxDotsY - 1) * step;
    const startX = centerX - gridWidth / 2;
    const startY = centerY - gridHeight / 2;

    // Find closest grid position
    const i = Math.round((mouseX - startX) / step);
    const j = Math.round((mouseY - startY) / step);
    
    if (i >= 0 && i < maxDotsX && j >= 0 && j < maxDotsY) {
      const dotX = startX + i * step;
      const dotY = startY + j * step;
      
      // Check if this dot exists in our dots array and if mouse is close enough
      const distance = Math.sqrt((mouseX - dotX) ** 2 + (mouseY - dotY) ** 2);
      if (distance <= dotSize / 2) {
        const dot = dots.find(d => Math.abs(d.x - dotX) < 1 && Math.abs(d.y - dotY) < 1);
        if (dot) {
          return { dot, gridKey: `${i}-${j}` };
        }
      }
    }
    return null;
  };

  // Mouse event handlers for painting
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (toolMode !== 'paint') return;
    
    setIsPainting(true);
    handlePaintDot(e);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (toolMode !== 'paint' || !isPainting) return;
    
    handlePaintDot(e);
  };

  const handleMouseUp = () => {
    setIsPainting(false);
  };

  const handlePaintDot = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const hitResult = findDotAtPosition(mouseX, mouseY);
    if (hitResult) {
      setDotColors(prev => new Map(prev).set(hitResult.gridKey, brushColor));
    }
  };

  // Warning system for structural changes
  const handleStructuralChange = (type: string, value: number) => {
    if (dotColors.size > 0) {
      setPendingChange({ type, value });
      setShowWarning(true);
    } else {
      applyChange(type, value);
    }
  };

  const applyChange = (type: string, value: number) => {
    switch (type) {
      case 'canvasWidth':
        setCanvasWidth(value);
        break;
      case 'canvasHeight':
        setCanvasHeight(value);
        break;
      case 'dotSize':
        setDotSize(value);
        break;
      case 'dotSpacing':
        setDotSpacing(value);
        break;
    }
    setDotColors(new Map());
  };

  const confirmChange = () => {
    if (pendingChange) {
      applyChange(pendingChange.type, pendingChange.value);
    }
    setShowWarning(false);
    setPendingChange(null);
  };

  const cancelChange = () => {
    setShowWarning(false);
    setPendingChange(null);
  };

  const clearDrawing = () => {
    setDotColors(new Map());
  };

  const exportPresets = {
    social: [
      { name: 'Twitter 2x', width: 800, height: 800, description: 'Retina quality for Twitter profiles' },
      { name: 'Twitter 1x', width: 400, height: 400, description: 'Standard Twitter profile size' },
      { name: 'Instagram', width: 640, height: 640, description: '2x for mobile displays' },
      { name: 'LinkedIn', width: 800, height: 800, description: 'Professional profile pictures' },
      { name: 'Facebook', width: 340, height: 340, description: '2x for Facebook profiles' }
    ],
    icon: [
      { name: '16x16', width: 16, height: 16, description: 'Small app icons' },
      { name: '32x32', width: 32, height: 32, description: 'Medium app icons' },
      { name: '64x64', width: 64, height: 64, description: 'Large app icons' },
      { name: '128x128', width: 128, height: 128, description: 'High-res app icons' }
    ],
    web: [
      { name: 'Small', width: 200, height: 200, description: 'Web thumbnails' },
      { name: 'Medium', width: 400, height: 400, description: 'Standard web logos' },
      { name: 'Large', width: 800, height: 800, description: 'High-res web display' }
    ],
    print: [
      { name: '1 inch @300dpi', width: 300, height: 300, description: 'Small print logos' },
      { name: '2 inch @300dpi', width: 600, height: 600, description: 'Medium print logos' },
      { name: '4 inch @300dpi', width: 1200, height: 1200, description: 'Large print logos' }
    ]
  };

  const exportPixelPerfectSVG = (targetWidth: number, targetHeight: number) => {
    // Calculate padded area
    const paddingPx = Math.min(targetWidth, targetHeight) * (exportPadding / 100);
    const drawAreaWidth = targetWidth - (paddingPx * 2);
    const drawAreaHeight = targetHeight - (paddingPx * 2);
    
    // Calculate scale to fit canvas in draw area
    const scaleX = drawAreaWidth / canvasWidth;
    const scaleY = drawAreaHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Center the scaled content within the padded area
    const scaledWidth = canvasWidth * scale;
    const scaledHeight = canvasHeight * scale;
    const offsetX = paddingPx + (drawAreaWidth - scaledWidth) / 2;
    const offsetY = paddingPx + (drawAreaHeight - scaledHeight) / 2;
    
    // Calculate scaled dot size and ensure it's at least 1px and rounded to nearest 0.5
    const scaledDotSize = Math.max(1, Math.round((dotSize * scale) * 2) / 2);
    
    // Generate optimized dots with pixel snapping and padding offset
    const optimizedDots = dots.map(dot => ({
      x: Math.round((dot.x * scale + offsetX) * 2) / 2, // Snap to half-pixels for crisp rendering
      y: Math.round((dot.y * scale + offsetY) * 2) / 2,
      color: dot.color
    }));

    // Generate background element if enabled
    const backgroundElement = useBackground 
      ? `  <rect x="0" y="0" width="${targetWidth}" height="${targetHeight}" fill="${backgroundColor}" />\n`
      : '';

    const svgContent = `<svg width="${targetWidth}" height="${targetHeight}" viewBox="0 0 ${targetWidth} ${targetHeight}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
${backgroundElement}${optimizedDots.map(dot => `  <circle cx="${dot.x}" cy="${dot.y}" r="${scaledDotSize / 2}" fill="${dot.color}" stroke="none" shape-rendering="crispEdges" />`).join('\n')}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Enhanced filename with padding and background info
    const bgSuffix = useBackground ? `-${backgroundColor.replace('#', '')}bg` : '-transparent';
    const paddingSuffix = exportPadding > 0 ? `-${exportPadding}p` : '';
    const sizeName = exportMode === 'custom' ? `${targetWidth}x${targetHeight}` : `${exportMode}-${targetWidth}x${targetHeight}`;
    link.download = `logo-${sizeName}${paddingSuffix}${bgSuffix}.svg`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPixelPerfectPNG = (targetWidth: number, targetHeight: number) => {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Calculate padded area
    const paddingPx = Math.min(targetWidth, targetHeight) * (exportPadding / 100);
    const drawAreaWidth = targetWidth - (paddingPx * 2);
    const drawAreaHeight = targetHeight - (paddingPx * 2);
    
    // Calculate scale to fit canvas in draw area
    const scaleX = drawAreaWidth / canvasWidth;
    const scaleY = drawAreaHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Center the scaled content within the padded area
    const scaledWidth = canvasWidth * scale;
    const scaledHeight = canvasHeight * scale;
    const offsetX = paddingPx + (drawAreaWidth - scaledWidth) / 2;
    const offsetY = paddingPx + (drawAreaHeight - scaledHeight) / 2;
    
    // Calculate scaled dot size
    const scaledDotSize = Math.max(1, Math.round((dotSize * scale) * 2) / 2);

    // Set up canvas for crisp rendering
    ctx.imageSmoothingEnabled = false;
    
    // Draw background if enabled
    if (useBackground) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else {
      // Transparent background
      ctx.clearRect(0, 0, targetWidth, targetHeight);
    }

    // Draw dots
    dots.forEach(dot => {
      const x = Math.round((dot.x * scale + offsetX) * 2) / 2;
      const y = Math.round((dot.y * scale + offsetY) * 2) / 2;
      
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(x, y, scaledDotSize / 2, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Convert to PNG and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Enhanced filename with padding and background info
        const bgSuffix = useBackground ? `-${backgroundColor.replace('#', '')}bg` : '-transparent';
        const paddingSuffix = exportPadding > 0 ? `-${exportPadding}p` : '';
        const sizeName = exportMode === 'custom' ? `${targetWidth}x${targetHeight}` : `${exportMode}-${targetWidth}x${targetHeight}`;
        link.download = `logo-${sizeName}${paddingSuffix}${bgSuffix}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0); // Maximum quality
  };

  const exportSVG = () => {
    exportPixelPerfectSVG(exportWidth, exportHeight);
  };

  const exportPNG = () => {
    exportPixelPerfectPNG(exportWidth, exportHeight);
  };

  const handleExport = () => {
    if (exportFormat === 'svg') {
      exportSVG();
    } else {
      exportPNG();
    }
  };

  const handlePresetExport = (preset: { name: string; width: number; height: number; description?: string }) => {
    if (exportFormat === 'svg') {
      exportPixelPerfectSVG(preset.width, preset.height);
    } else {
      exportPixelPerfectPNG(preset.width, preset.height);
    }
  };

  const handleExportModeChange = (mode: 'social' | 'icon' | 'web' | 'print' | 'custom') => {
    setExportMode(mode);
    if (mode !== 'custom') {
      const presets = exportPresets[mode];
      if (presets.length > 0) {
        setExportWidth(presets[0].width);
        setExportHeight(presets[0].height);
      }
    }
    
    // Set recommended format and padding based on mode
    if (mode === 'social') {
      setExportFormat('png'); // Social media needs PNG/JPG
      setExportPadding(15); // Good padding for social media profile pictures
    } else if (mode === 'icon') {
      setExportFormat('png'); // App icons are usually PNG
      setExportPadding(8); // Minimal padding for app icons
    } else if (mode === 'web') {
      setExportFormat('svg'); // Web prefers SVG for scalability
      setExportPadding(10); // Moderate padding for web logos
    } else if (mode === 'print') {
      setExportFormat('png'); // Print needs high-res raster
      setExportPadding(5); // Minimal padding for print to maximize space
    }
  };

  const handleExportSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (dimension === 'width') {
      setExportWidth(value);
      if (maintainAspectRatio) {
        const aspectRatio = canvasHeight / canvasWidth;
        setExportHeight(Math.round(value * aspectRatio));
      }
    } else {
      setExportHeight(value);
      if (maintainAspectRatio) {
        const aspectRatio = canvasWidth / canvasHeight;
        setExportWidth(Math.round(value * aspectRatio));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Circle of Dots Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Tool Mode</h2>
              
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setToolMode('generate')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    toolMode === 'generate' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Generate
                </button>
                <button
                  onClick={() => setToolMode('paint')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    toolMode === 'paint' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Paint
                </button>
              </div>

              <h2 className="text-xl font-semibold mb-4">Controls</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Canvas Width: {canvasWidth}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    value={canvasWidth}
                    onChange={(e) => handleStructuralChange('canvasWidth', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Canvas Height: {canvasHeight}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    value={canvasHeight}
                    onChange={(e) => handleStructuralChange('canvasHeight', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dot Size: {dotSize}px
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    value={dotSize}
                    onChange={(e) => handleStructuralChange('dotSize', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dot Spacing: {dotSpacing}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={dotSpacing}
                    onChange={(e) => handleStructuralChange('dotSpacing', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Default Dot Color
                  </label>
                  <input
                    type="color"
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </div>
                
                {toolMode === 'paint' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Brush Color
                    </label>
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
              
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Export Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Export Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['social', 'icon', 'web', 'print', 'custom'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleExportModeChange(mode)}
                          className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors capitalize ${
                            exportMode === mode 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Settings */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Background</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="useBackground"
                          checked={useBackground}
                          onChange={(e) => setUseBackground(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="useBackground" className="text-sm">
                          Use background color
                        </label>
                      </div>
                      {useBackground && (
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Padding Control */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Padding: {exportPadding}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={exportPadding}
                      onChange={(e) => setExportPadding(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0% (No padding)</span>
                      <span>40% (Maximum)</span>
                    </div>
                  </div>

                  {/* Export Format Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Export Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setExportFormat('png')}
                        className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                          exportFormat === 'png' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        PNG
                        <div className="text-xs opacity-70 mt-1">For social media</div>
                      </button>
                      <button
                        onClick={() => setExportFormat('svg')}
                        className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                          exportFormat === 'svg' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        SVG
                        <div className="text-xs opacity-70 mt-1">Vector graphics</div>
                      </button>
                    </div>
                  </div>

                  {exportMode !== 'custom' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Quick Export</label>
                      <div className="space-y-2">
                        {exportPresets[exportMode].map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => handlePresetExport(preset)}
                            className="w-full px-3 py-3 text-left bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs text-green-100 mt-1">{preset.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {exportMode === 'custom' && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id="maintainAspectRatio"
                          checked={maintainAspectRatio}
                          onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="maintainAspectRatio" className="text-sm">
                          Maintain aspect ratio
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Export Width: {exportWidth}px
                          </label>
                          <input
                            type="number"
                            min="16"
                            max="2000"
                            value={exportWidth}
                            onChange={(e) => handleExportSizeChange('width', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Export Height: {exportHeight}px
                          </label>
                          <input
                            type="number"
                            min="16"
                            max="2000"
                            value={exportHeight}
                            onChange={(e) => handleExportSizeChange('height', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Export Preview */}
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Export Preview</h4>
                  <div className="flex items-start gap-4">
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 flex-1">
                      <p>Target: {exportWidth}×{exportHeight}px</p>
                      {(() => {
                        const paddingPx = Math.min(exportWidth, exportHeight) * (exportPadding / 100);
                        const drawAreaWidth = exportWidth - (paddingPx * 2);
                        const drawAreaHeight = exportHeight - (paddingPx * 2);
                        const scale = Math.min(drawAreaWidth / canvasWidth, drawAreaHeight / canvasHeight);
                        const scaledDotSize = Math.max(1, Math.round((dotSize * scale) * 2) / 2);
                        const logoWidth = Math.round(canvasWidth * scale);
                        const logoHeight = Math.round(canvasHeight * scale);
                        
                        return (
                          <>
                            <p>Padding: {paddingPx.toFixed(0)}px ({exportPadding}%)</p>
                            <p>Logo area: {logoWidth}×{logoHeight}px</p>
                            <p>Scale: {(scale * 100).toFixed(0)}%</p>
                            <p>Dot size: {scaledDotSize}px</p>
                            {useBackground && <p>Background: {backgroundColor}</p>}
                            <p>Format: {exportFormat.toUpperCase()}</p>
                            <p>Est. size: ~{(() => {
                              if (exportFormat === 'svg') {
                                return Math.round(((dots.length * 50) + 300) / 1024);
                              } else {
                                // PNG size estimate based on dimensions and complexity
                                const pixels = exportWidth * exportHeight;
                                const complexity = dots.length / (canvasWidth * canvasHeight / 100); // dots per 100px²
                                return Math.round((pixels * (useBackground ? 3 : 4) * Math.min(complexity + 0.5, 2)) / 1024);
                              }
                            })()}KB</p>
                          </>
                        );
                      })()}
                    </div>
                    <div 
                      className="border border-gray-300 dark:border-gray-600 flex-shrink-0 relative"
                      style={{
                        width: Math.min(140, exportWidth * 0.35),
                        height: Math.min(140, exportHeight * 0.35),
                        backgroundColor: useBackground ? backgroundColor : 'white'
                      }}
                    >
                      <svg
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${exportWidth} ${exportHeight}`}
                        className="w-full h-full"
                        style={{ imageRendering: 'crisp-edges' }}
                      >
                        {/* Background */}
                        {useBackground && (
                          <rect
                            x="0"
                            y="0"
                            width={exportWidth}
                            height={exportHeight}
                            fill={backgroundColor}
                          />
                        )}
                        
                        {/* Padding area outline - for preview only, not included in export */}
                        {exportPadding > 0 && (
                          <rect
                            x={Math.min(exportWidth, exportHeight) * (exportPadding / 100)}
                            y={Math.min(exportWidth, exportHeight) * (exportPadding / 100)}
                            width={exportWidth - (Math.min(exportWidth, exportHeight) * (exportPadding / 100) * 2)}
                            height={exportHeight - (Math.min(exportWidth, exportHeight) * (exportPadding / 100) * 2)}
                            fill="none"
                            stroke="#ff0000"
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                            opacity="0.3"
                          />
                        )}
                        
                        {/* Dots */}
                        {(() => {
                          const paddingPx = Math.min(exportWidth, exportHeight) * (exportPadding / 100);
                          const drawAreaWidth = exportWidth - (paddingPx * 2);
                          const drawAreaHeight = exportHeight - (paddingPx * 2);
                          const scale = Math.min(drawAreaWidth / canvasWidth, drawAreaHeight / canvasHeight);
                          const scaledWidth = canvasWidth * scale;
                          const scaledHeight = canvasHeight * scale;
                          const offsetX = paddingPx + (drawAreaWidth - scaledWidth) / 2;
                          const offsetY = paddingPx + (drawAreaHeight - scaledHeight) / 2;
                          const scaledDotSize = Math.max(1, Math.round((dotSize * scale) * 2) / 2);
                          
                          return dots.map((dot, index) => (
                            <circle
                              key={index}
                              cx={Math.round((dot.x * scale + offsetX) * 2) / 2}
                              cy={Math.round((dot.y * scale + offsetY) * 2) / 2}
                              r={scaledDotSize / 2}
                              fill={dot.color}
                              stroke="none"
                            />
                          ));
                        })()}
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleExport}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Export {exportMode === 'custom' ? `${exportWidth}×${exportHeight}` : exportMode} {exportFormat.toUpperCase()}
                  </button>
                  
                  {toolMode === 'paint' && dotColors.size > 0 && (
                    <button
                      onClick={clearDrawing}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>Canvas: {canvasWidth}×{canvasHeight}px</p>
                <p>Dots in circle: {dots.length}</p>
                <p>Circle radius: {Math.round(Math.min(canvasWidth, canvasHeight) / 2 - dotSize / 2)}px</p>
                {toolMode === 'paint' && <p>Painted dots: {dotColors.size}</p>}
                <p className="pt-1 border-t border-gray-300 dark:border-gray-600 mt-2">
                  Export: {exportWidth}×{exportHeight}px ({exportMode} mode)
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900">
              <svg
                width={Math.min(canvasWidth, 500)}
                height={Math.min(canvasHeight, 500)}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                className={`border border-gray-200 dark:border-gray-700 ${toolMode === 'paint' ? 'cursor-crosshair' : 'cursor-default'}`}
                style={{
                  maxWidth: '500px',
                  maxHeight: '500px',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {dots.map((dot, index) => (
                  <circle
                    key={index}
                    cx={dot.x}
                    cy={dot.y}
                    r={dotSize / 2}
                    fill={dot.color}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Warning</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Resizing will reset your drawing. Do you want to continue?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelChange}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}