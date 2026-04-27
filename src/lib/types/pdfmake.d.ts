// Type declarations for pdfmake 0.3.x
// pdfmake doesn't ship its own types in v0.3+

declare module "pdfmake/build/pdfmake" {
  import type { TDocumentDefinitions, TFontDictionary } from "pdfmake";

  interface PdfMakeStatic {
    createPdf(
      docDefinition: TDocumentDefinitions,
      tableLayouts?: Record<string, unknown>,
      fonts?: TFontDictionary
    ): {
      download(defaultFileName?: string): void;
      open(): void;
      getBuffer(cb: (buffer: Buffer) => void): void;
      getBase64(cb: (base64: string) => void): void;
      getBlob(cb: (blob: Blob) => void): void;
    };
    vfs: Record<string, string>;
    fonts: TFontDictionary;
  }

  const pdfMake: PdfMakeStatic;
  export default pdfMake;
}

declare module "pdfmake/build/vfs_fonts" {
  const vfs: Record<string, string>;
  export default vfs;
}
