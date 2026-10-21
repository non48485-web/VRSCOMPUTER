import sys
import os
import time
from PyQt6.QtWidgets import QApplication
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import QUrl, QMarginsF
from PyQt6.QtGui import QPageLayout, QPageSize

def generate():
    app = QApplication(sys.argv)
    view = QWebEngineView()
    
    html_path = os.path.abspath("d:/VRS Computer/docs/system_architecture_diagrams.html")
    pdf_path = os.path.abspath("d:/VRS Computer/VRS_COMPUTER_SYSTEM_ARCHITECTURE.pdf")
    
    if os.path.exists(pdf_path):
        try:
            os.remove(pdf_path)
        except Exception:
            pass

    def on_pdf_finished(path, success):
        print(f"PDF creation result: {success} at {path}")
        app.quit()

    def on_load_finished(ok):
        if not ok:
            print("Failed to load HTML file")
            app.quit()
            return
        print("HTML loaded successfully, waiting 2s for fonts and styles to settle...")
        # give a moment for layout/fonts
        layout = QPageLayout(
            QPageSize(QPageSize.PageSizeId.A4),
            QPageLayout.Orientation.Portrait,
            QMarginsF(0, 0, 0, 0)
        )
        view.page().pdfPrintingFinished.connect(on_pdf_finished)
        view.page().printToPdf(pdf_path, layout)

    view.loadFinished.connect(on_load_finished)
    # Using file URL
    file_url = QUrl.fromLocalFile(html_path)
    print(f"Loading {file_url.toString()}...")
    view.load(file_url)
    
    sys.exit(app.exec())

if __name__ == "__main__":
    generate()
