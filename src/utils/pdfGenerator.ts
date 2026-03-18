import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


export const downloadResumePDF = async (resumeName: string): Promise<void> => {
  const element = document.getElementById('resume-content');
  if (!element) {
    alert('Resume content not found. Please try again.');
    return;
  }

  try {
    // ── 1. Capture the resume as a high-res canvas image ──────────────────────
    const scale = 2;
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 dimensions in mm
    const pageWidthMm  = 210;
    const pageHeightMm = 297;

    const imgWidthMm  = pageWidthMm;
    const imgHeightMm = (canvas.height * pageWidthMm) / canvas.width;

    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

    // ── 2. Stamp the image across however many A4 pages are needed ────────────
    let heightLeft = imgHeightMm;
    let yOffset    = 0;

    pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidthMm, imgHeightMm);
    heightLeft -= pageHeightMm;

    while (heightLeft > 0) {
      yOffset -= pageHeightMm;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidthMm, imgHeightMm);
      heightLeft -= pageHeightMm;
    }

    // ── 3. Overlay invisible clickable link annotations ────────────────────────
    // Each template renders links as <a data-pdf-link href="..."> so we can
    // query them here, get their pixel bounding boxes, and map them to mm.
    const elementRect = element.getBoundingClientRect();
    const pxToMmX = pageWidthMm / element.offsetWidth;
    const pxToMmY = pageWidthMm / element.offsetWidth; // uniform scale

    const anchors = element.querySelectorAll<HTMLAnchorElement>('a[data-pdf-link]');

    anchors.forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href) return;

      const anchorRect = anchor.getBoundingClientRect();

      // Position of anchor relative to the resume element (in px)
      const relX = anchorRect.left - elementRect.left;
      const relY = anchorRect.top  - elementRect.top;

      // Convert to mm
      const xMm = relX * pxToMmX;
      const yMm = relY * pxToMmY;
      const wMm = anchorRect.width  * pxToMmX;
      const hMm = anchorRect.height * pxToMmY;

      // Which PDF page does this fall on?
      const page      = Math.floor(yMm / pageHeightMm) + 1;
      const yOnPage   = yMm - (page - 1) * pageHeightMm;

      pdf.setPage(page);
      pdf.link(xMm, yOnPage, wMm, hMm, { url: href });
    });

    // ── 4. Save ───────────────────────────────────────────────────────────────
    const safeFileName = resumeName.replace(/[^a-z0-9_\-\s]/gi, '').trim() || 'resume';
    pdf.save(`${safeFileName}.pdf`);
  } catch (err) {
    console.error('PDF generation failed:', err);
    alert('Failed to generate PDF. Please try again.');
  }
};
