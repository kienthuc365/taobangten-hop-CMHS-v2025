
import { jsPDF } from 'jspdf';
import { Student, TagConfig } from '../types';

/**
 * Generates an A4 PDF containing name tags for each student.
 * Each page contains exactly 5 tags in a vertical layout.
 */
export const generatePDF = async (
  students: Student[],
  background: string,
  config: TagConfig
): Promise<void> => {
  // A4 dimensions in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const tagWidth = 180; // 18cm width
  const tagHeight = 50;  // 5cm height
  const tagsPerPage = 5;
  const spacing = 6; // Space between tags

  // Pre-calculate off-screen canvas rendering to ensure high quality (300 DPI approx)
  // 180mm x 50mm at ~300 DPI is roughly 2125 x 590 px
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Could not create canvas context");

  const canvasWidth = 2000;
  const canvasHeight = Math.floor((canvasWidth * tagHeight) / tagWidth);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const bgImg = new Image();
  bgImg.src = background;

  // Wait for background image to load
  await new Promise((resolve) => {
    if (bgImg.complete) resolve(true);
    else bgImg.onload = () => resolve(true);
  });

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const pageItemIndex = i % tagsPerPage;

    if (i > 0 && pageItemIndex === 0) {
      pdf.addPage();
    }

    // Render Tag to Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    const weight = config.fontWeight === 'bold' ? 'bold ' : '';
    // Scale font size from UI preview (600px) to PDF canvas (2000px)
    const scaledFontSize = (config.fontSize * canvasWidth) / 600;
    ctx.font = `${weight}${scaledFontSize}px ${config.fontFamily}`;
    ctx.fillStyle = config.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let displayText = student.name;
    if (config.textTransform === 'uppercase') displayText = displayText.toUpperCase();
    if (config.textTransform === 'capitalize') {
      displayText = displayText.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }

    const x = (canvas.width * config.xOffset) / 100;
    const y = (canvas.height * config.yOffset) / 100;
    ctx.fillText(displayText, x, y);

    // Convert canvas to image and add to PDF
    const tagDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    // Calculate vertical position on A4
    const startY = margin + (pageItemIndex * (tagHeight + spacing));
    const startX = (pageWidth - tagWidth) / 2;

    pdf.addImage(tagDataUrl, 'JPEG', startX, startY, tagWidth, tagHeight);
    
    // Optional: Add a light cut line around the tag
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.1);
    pdf.rect(startX, startY, tagWidth, tagHeight);
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  pdf.save(`Danh_Sach_Bang_Ten_${timestamp}.pdf`);
};
