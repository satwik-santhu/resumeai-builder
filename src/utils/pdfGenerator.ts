export const downloadResumePDF = (resumeName: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to download the resume');
    return;
  }

  const resumeContent = document.getElementById('resume-content');
  if (!resumeContent) {
    alert('Resume content not found');
    return;
  }

  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${resumeName}</title>
        <style>
          ${styles}
          @media print {
            body { margin: 0; padding: 0; }
            @page { margin: 0.5in; }
          }
        </style>
      </head>
      <body>
        ${resumeContent.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    setTimeout(() => {
      printWindow.close();
    }, 100);
  }, 250);
};
