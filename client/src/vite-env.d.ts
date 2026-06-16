/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_AUTH: string;
  readonly VITE_FRONTED_PANCONTROL: string;
  readonly VITE_FRONTED_WEB: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@react-pdf/renderer' {
  import { FC, ReactNode } from 'react';

  export const Document: FC<{ children?: ReactNode }>;
  export const Page: FC<{ children?: ReactNode; size?: string; style?: any }>;
  export const Text: FC<{ children?: ReactNode; style?: any }>;
  export const View: FC<{ children?: ReactNode; style?: any }>;
  export const StyleSheet: { create: (styles: any) => any };
  export const Font: { register: (config: any) => void };
  export const Image: FC<{ src?: string; style?: any }>;
  export const pdf: (doc: any) => any;
  export const BlobProvider: FC<{ document: any; children: (params: { url: string | null; blob: Blob | null }) => ReactNode }>;
  export const PDFViewer: FC<{ children?: ReactNode; style?: any; showToolbar?: boolean }>;
  export const PDFDownloadLink: FC<{ document: any; fileName?: string; children?: ReactNode | ((params: { loading: boolean }) => ReactNode); style?: any }>;
}
