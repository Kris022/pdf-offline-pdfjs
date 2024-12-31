import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker outside the component
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
  scale?: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, scale = 1.5 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingTaskRef = useRef<pdfjsLib.PDFDocumentLoadingTask | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        // Cancel any existing loading task
        if (loadingTaskRef.current) {
          await loadingTaskRef.current.destroy();
        }

        // Load the PDF document
        loadingTaskRef.current = pdfjsLib.getDocument(url);
        const pdf = await loadingTaskRef.current.promise;

        // Get the first page
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale });

        // Get canvas and context
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Support HiDPI-screens
        const outputScale = window.devicePixelRatio || 1;

        // Set canvas dimensions
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        // Set transform for HiDPI screens
        const transform = outputScale !== 1
          ? [outputScale, 0, 0, outputScale, 0, 0]
          : [1, 0, 0, 1, 0, 0];

        // Render PDF page
        const renderContext = {
          canvasContext: context,
          transform,
          viewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();

    // Cleanup function
    return () => {
      if (loadingTaskRef.current) {
        loadingTaskRef.current.destroy().catch(console.error);
      }
    };
  }, [url, scale]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <canvas 
        ref={canvasRef}
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default PDFViewer;