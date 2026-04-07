"use client";

import dynamic from 'next/dynamic';
import { FileText } from 'lucide-react';

const PdfCover = dynamic(() => import('./PdfCover'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gray-50 animate-pulse flex items-center justify-center text-gray-300"><FileText size={48} /></div>
});

interface PublicationCoverProps {
    pdfUrl: string;
    coverUrl?: string | null;
    title?: string;
}

export default function PublicationCover({ pdfUrl, coverUrl, title }: PublicationCoverProps) {
    if (coverUrl) {
        return (
            <div className="w-full h-full relative overflow-hidden bg-white flex items-center justify-center">
                <img 
                    src={coverUrl} 
                    alt={title || "Publication Cover"} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        // If image fails, hide it to trigger fallback if we had one,
                        // or just show a fallback icon.
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            </div>
        );
    }

    // Fallback to client-side PDF rendering
    return <PdfCover pdfUrl={pdfUrl} title={title} />;
}
