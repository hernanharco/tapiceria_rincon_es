declare module 'sonner' {
  export const toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
    dismiss: () => void;
  };
  export const Toaster: any;
}

declare module 'react-hot-toast' {
  const toast: any;
  export default toast;
  export const Toaster: any;
}

declare module 'sweetalert2' {
  const Swal: any;
  export default Swal;
}

declare module 'dayjs' {
  const dayjs: any;
  export default dayjs;
}

declare module 'html2canvas' {
  const html2canvas: any;
  export default html2canvas;
}

declare module 'jspdf' {
  const jsPDF: any;
  export default jsPDF;
}

declare module 'buffer' {
  export const Buffer: any;
}

declare module 'react-pdf' {
  export const Document: any;
  export const Page: any;
  export const pdfjs: any;
}
