'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import {
  Undo, Redo, ZoomIn, ZoomOut, FlipHorizontal, Copy,
  Image as ImageIcon, Pen, Download, Type
} from 'lucide-react';

interface MemeEditorProps {
  templateUrl: string;
}

export default function MemeEditor({ templateUrl }: MemeEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: '#f3f4f6',
      preserveObjectStacking: true,
    });

    setCanvas(initCanvas);

    if (templateUrl) {
      fabric.Image.fromURL(templateUrl, (img) => {
        if (!img) return;
        const scale = Math.min(
          initCanvas.width! / (img.width || 1),
          initCanvas.height! / (img.height || 1)
        );
        img.scale(scale);
        initCanvas.centerObject(img);
        img.set({ selectable: false, evented: false });
        initCanvas.setBackgroundImage(img, initCanvas.renderAll.bind(initCanvas));
      }, { crossOrigin: 'anonymous' });
    }

    return () => {
      initCanvas.dispose();
    };
  }, [templateUrl]);

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Double click to edit', {
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

  const zoomIn = () => {
    if (!canvas) return;
    const newZoom = zoomLevel * 1.1;
    setZoomLevel(newZoom);
    canvas.setZoom(newZoom);
  };

  const zoomOut = () => {
    if (!canvas) return;
    const newZoom = zoomLevel / 1.1;
    setZoomLevel(newZoom);
    canvas.setZoom(newZoom);
  };

  const flipHorizontal = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('flipX', !activeObject.flipX);
      canvas.renderAll();
    }
  };

  const duplicate = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.clone((clonedObj: any) => {
        canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 20,
          top: clonedObj.top + 20,
          evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
          clonedObj.canvas = canvas;
          clonedObj.forEachObject((obj: any) => canvas.add(obj));
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }
        canvas.setActiveObject(clonedObj);
        canvas.renderAll();
      });
    }
  };

  const toggleDraw = () => {
    if (!canvas) return;
    const newDrawState = !canvas.isDrawingMode;
    canvas.isDrawingMode = newDrawState;
    if (newDrawState) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = '#ef4444'; // Red brush
      canvas.freeDrawingBrush.width = 5;
    }
    setIsDrawing(newDrawState);
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result as string;
      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(150);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const downloadMeme = () => {
    if (!canvas) return;
    // Temporarily reset zoom for export
    const currentZoom = canvas.getZoom();
    canvas.setZoom(1);

    canvas.discardActiveObject();
    canvas.renderAll();

    const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
    const link = document.createElement('a');
    link.download = 'meme-generator.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Restore zoom
    canvas.setZoom(currentZoom);
  };

  const ToolButton = ({ onClick, icon: Icon, label, active = false }: any) => (
    <button
      onClick={onClick}
      title={label}
      className={`p-2 rounded-md border flex items-center justify-center transition-colors ${active
        ? 'bg-blue-100 border-blue-400 text-blue-700'
        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
    >
      <Icon size={20} />
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 w-full max-w-[600px] bg-gray-100 p-3 rounded-lg justify-center items-center">
        <ToolButton icon={Undo} label="Undo (Not fully supported yet)" />
        <ToolButton icon={Redo} label="Redo (Not fully supported yet)" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolButton onClick={zoomOut} icon={ZoomOut} label="Zoom Out" />
        <span className="text-sm font-medium w-12 text-center text-gray-600">
          {Math.round(zoomLevel * 100)}%
        </span>
        <ToolButton onClick={zoomIn} icon={ZoomIn} label="Zoom In" />

        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolButton onClick={flipHorizontal} icon={FlipHorizontal} label="Flip Object" />
        <ToolButton onClick={duplicate} icon={Copy} label="Duplicate Object" />

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button onClick={toggleDraw} className={`px-3 py-2 rounded-md border flex items-center gap-2 text-sm font-medium transition-colors ${isDrawing ? 'bg-red-500 text-white border-red-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
          <Pen size={16} /> Draw
        </button>

        <label className="cursor-pointer px-3 py-2 rounded-md border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors">
          <ImageIcon size={16} /> Add Image
          <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
        </label>

        <button onClick={addText} className="px-3 py-2 rounded-md border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors">
          <Type size={16} /> Add Text
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button onClick={downloadMeme} className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 flex items-center gap-2 transition-colors">
          <Download size={16} /> Download
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-gray-50">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-xs text-gray-400">Select objects to drag, flip, or duplicate them.</p>
    </div>
  );
}
