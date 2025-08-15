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

  const exportSVG = () => {
    const svgContent = `<svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
${dots.map(dot => `  <circle cx="${dot.x}" cy="${dot.y}" r="${dotSize / 2}" fill="${dot.color}" shape-rendering="crispEdges" />`).join('\n')}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'circle-of-dots.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={exportSVG}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Export to SVG
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
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>Dots in circle: {dots.length}</p>
                <p>Circle radius: {Math.round(Math.min(canvasWidth, canvasHeight) / 2 - dotSize / 2)}px</p>
                {toolMode === 'paint' && <p>Painted dots: {dotColors.size}</p>}
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