declare module 'sonner' {
  export const toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
    dismiss: () => void;
    promise: <T>(promise: Promise<T> | (() => Promise<T>), opts?: { loading?: string; success?: string; error?: string; duration?: number }) => Promise<T>;
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

declare module 'react-icons/fa' {
  import { FC, SVGProps } from 'react';
  type FaIcon = FC<SVGProps<SVGSVGElement> & { className?: string; size?: number }>;
  export const FaFileInvoice: FaIcon;
  export const FaRegEdit: FaIcon;
  export const FaRegTrashAlt: FaIcon;
  export const FaUserPlus: FaIcon;
  export const FaSearch: FaIcon;
  export const FaMapMarkerAlt: FaIcon;
  export const FaPhoneAlt: FaIcon;
  export const FaTimes: FaIcon;
  export const FaSpinner: FaIcon;
  export const FaCheck: FaIcon;
  export const FaPlus: FaIcon;
  export const FaTrash: FaIcon;
  export const FaEdit: FaIcon;
  export const FaEye: FaIcon;
  export const FaDownload: FaIcon;
  export const FaWhatsapp: FaIcon;
  export const FaPrint: FaIcon;
  export const FaSort: FaIcon;
  export const FaSortUp: FaIcon;
  export const FaSortDown: FaIcon;
  export const FaExclamationTriangle: FaIcon;
  export const FaFilePdf: FaIcon;
  export const FaFileAlt: FaIcon;
  export const FaEnvelope: FaIcon;
  export const FaCog: FaIcon;
  export const FaSignOutAlt: FaIcon;
  export const FaBars: FaIcon;
  export const FaChevronLeft: FaIcon;
  export const FaChevronRight: FaIcon;
  export const FaCircle: FaIcon;
  export const FaInfoCircle: FaIcon;
  export const FaUser: FaIcon;
  export const FaBuilding: FaIcon;
  export const FaCalendarAlt: FaIcon;
  export const FaTag: FaIcon;
  export const FaDollarSign: FaIcon;
  export const FaPercent: FaIcon;
  export const FaBell: FaIcon;
  export const FaHome: FaIcon;
  export const FaFolder: FaIcon;
  export const FaClipboardList: FaIcon;
  export const FaHistory: FaIcon;
  export const FaUserFriends: FaIcon;
  export const FaTools: FaIcon;
  export const FaGlobe: FaIcon;
  export const FaIdCard: FaIcon;
  export const FaCity: FaIcon;
  export const FaMapMarkedAlt: FaIcon;
  export const FaPhone: FaIcon;
  export const FaFilter: FaIcon;
  export const FaReceipt: FaIcon;
  export const FaShareAlt: FaIcon;
}
