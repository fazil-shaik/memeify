'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric/index';

interface MemeEditorProps {
  templateUrl: string;
}

export default function MemeEditor({ templateUrl }: MemeEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize canvas
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 500,
      backgroundColor: '#f3f4f6',
    });

    setCanvas(initCanvas);

    // Load template image
    if (templateUrl) {
      fabric.Image.fromURL(templateUrl, (img) => {
        // Scale image to fit canvas
        const scale = Math.min(
          initCanvas.width! / img.width!,
          initCanvas.height! / img.height!
        );

        img.scale(scale);

        // Center image
        initCanvas.centerObject(img);

        // Set as background
        img.set({
          selectable: false,
          evented: false,
        });

        initCanvas.setBackgroundImage(img, initCanvas.renderAll.bind(initCanvas));
      }, { crossOrigin: 'anonymous' });
    }

    return () => {
      initCanvas.dispose();
    };
  }, [templateUrl]);

  const addText = () => {
    if (!canvas) return;

    const text = new fabric.IText('TOP TEXT', {
      left: canvas.width! / 2,
      top: 50,
      fontFamily: 'Impact',
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
      fontSize: 40,
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const downloadMeme = () => {
    if (!canvas) return;

    // Deselect objects so selection handles don't show in download
    canvas.discardActiveObject();
    canvas.renderAll();

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });

    const link = document.createElement('a');
    link.download = 'my-meme.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={addText}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Text
        </button>
        <button
          onClick={downloadMeme}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Download Meme
        </button>
      </div>
      <div className="border-4 border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Click on text to edit. Drag to move. Use corner handles to resize.
      </p>
    </div>
  );
}
