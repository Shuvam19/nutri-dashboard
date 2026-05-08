"use client";

import { useState } from "react";
import { generateAndUploadPdf } from "@/app/actions/pdf";

interface DietPlanActionBarProps {
  planId: string;
  clientPhone?: string | null;
  clientName?: string | null;
  planTitle: string;
}

export default function DietPlanActionBar({
  planId,
  clientPhone,
  clientName,
  planTitle,
}: DietPlanActionBarProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateAndUploadPdf(planId);
      if (result.success && result.url) {
        setPdfUrl(result.url);
        // Auto-download
        window.open(result.url, "_blank");
      } else {
        setError(result.message || "Failed to generate PDF");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareWhatsApp = async () => {
    let url = pdfUrl;

    // If we don't have a URL yet, generate the PDF first
    if (!url) {
      setIsGenerating(true);
      setError(null);
      try {
        const result = await generateAndUploadPdf(planId);
        if (result.success && result.url) {
          url = result.url;
          setPdfUrl(url);
        } else {
          setError(result.message || "Failed to generate PDF");
          setIsGenerating(false);
          return;
        }
      } catch (err) {
        setError("Failed to generate PDF for sharing");
        setIsGenerating(false);
        return;
      }
      setIsGenerating(false);
    }

    // Build WhatsApp message with the PDF link
    const message = [
      `*${planTitle}*`,
      clientName ? `Dear ${clientName},` : "",
      "",
      "Please find your personalized diet plan below:",
      url,
      "",
      "_— NutriCore Wellness Clinic_",
    ]
      .filter(Boolean)
      .join("\n");

    const phone = clientPhone?.replace(/\D/g, "") || "";
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        {/* Download PDF */}
        <button
          onClick={handleGeneratePdf}
          disabled={isGenerating}
          className="bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] font-medium py-2 px-4 rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
        >
          {isGenerating ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              Generating...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              Download PDF
            </>
          )}
        </button>

        {/* Share via WhatsApp */}
        <button
          onClick={handleShareWhatsApp}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share via WhatsApp
        </button>
      </div>

      {/* Re-download link if already generated */}
      {pdfUrl && !isGenerating && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          Open generated PDF
        </a>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}
