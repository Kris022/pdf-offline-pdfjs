import PDFViewer from "./components/PdfViewer";
import localPdf from "./assets/test.pdf";

function App() {
  return (
    <>
      {/* <PDFViewer url="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" /> */}
      <PDFViewer url={localPdf} />
      {/* <PDFViewer url="https://www.ox.ac.uk/sites/files/oxford/media_wysiwyg/University%20of%20Oxford%20Style%20Guide.pdf" /> */}
    </>
  );
}

export default App;
