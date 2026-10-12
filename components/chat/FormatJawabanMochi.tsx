"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Scale, BookOpen, Info, ArrowUpRight } from "lucide-react";

interface FormatJawabanMochiProps {
  content: string;
  isStreaming?: boolean;
}

// Daftar status hukum fiqih untuk penyorotan visual santri
const STATUS_BOLEH = /^(boleh|mubah|ja['’]?iz|sah|diperbolehkan|rukhsah)$/i;
const STATUS_HARAM = /^(haram|tidak sah|batal|terlarang|dilarang)$/i;
const STATUS_WAJIB = /^(wajib|fardhu|fard|lazim)$/i;
const STATUS_MAKRUH = /^(makruh)$/i;
const STATUS_SUNNAH = /^(sunnah|sunat|mandub|mustahab)$/i;

// Mendeteksi apakah string didominasi teks Arab
function isTeksArab(text: string): boolean {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const nonSpaceChars = text.replace(/\s+/g, "").length;
  return nonSpaceChars > 0 && arabicChars / nonSpaceChars > 0.35;
}

/**
 * Mem-parse teks inline: bold, italic, code, sitasi [S1], dan tautan [label](url).
 * Menghilangkan tanda asterik mentah dan memberikan aksen visual.
 */
function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];

  // Regex gabungan untuk token inline:
  // 1: Markdown Link [text](url)
  // 2: Sitasi [S1], [S2], dsb.
  // 3: Bold **text** atau __text__
  // 4: Italic *text* atau _text_
  // 5: Inline code `text`
  const inlineRegex =
    /(\[([^\]]+)\]\(([^)]+)\))|(\[(S\d+)\])|(\*\*([^*]+)\*\*|__([^_]+)__)|(\*([^*]+)\*|_([^_]+)_)|(`([^`]+)`)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = inlineRegex.exec(text)) !== null) {
    const matchIndex = match.index;

    // Teks biasa sebelum match
    if (matchIndex > lastIndex) {
      elements.push(text.substring(lastIndex, matchIndex));
    }

    const [
      fullMatch,
      isLink,
      linkText,
      linkUrl,
      isCitation,
      citationCode,
      isBold,
      boldTextStar,
      boldTextUnder,
      isItalic,
      italicTextStar,
      italicTextUnder,
      isCode,
      codeText,
    ] = match;

    if (isLink && linkText && linkUrl) {
      const isInternal = linkUrl.startsWith("/") || linkUrl.startsWith("#");
      if (isInternal) {
        elements.push(
          <Link
            key={`link-${keyCounter++}`}
            href={linkUrl}
            className="inline-flex items-center gap-0.5 font-semibold text-[#1E3F30] underline underline-offset-2 hover:text-emerald-700 transition-colors"
          >
            <span>{linkText}</span>
            <ArrowUpRight className="h-3 w-3 inline opacity-70" />
          </Link>
        );
      } else {
        elements.push(
          <a
            key={`extlink-${keyCounter++}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-semibold text-[#1E3F30] underline underline-offset-2 hover:text-emerald-700 transition-colors"
          >
            <span>{linkText}</span>
            <ArrowUpRight className="h-3 w-3 inline opacity-70" />
          </a>
        );
      }
    } else if (isCitation && citationCode) {
      elements.push(
        <span
          key={`cite-${keyCounter++}`}
          className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded-md bg-[#1E3F30]/10 text-[#1E3F30] border border-[#1E3F30]/25 font-mono text-[10px] font-bold align-baseline shadow-2xs hover:bg-[#1E3F30]/20 transition-colors"
          title={`Rujukan Keputusan ${citationCode}`}
        >
          {citationCode}
        </span>
      );
    } else if (isBold) {
      const rawBold = (boldTextStar || boldTextUnder || "").trim();

      // Penyorotan status hukum fiqih santri
      if (STATUS_BOLEH.test(rawBold)) {
        elements.push(
          <span
            key={`bold-hukum-${keyCounter++}`}
            className="inline-block px-1.5 py-0.2 mx-0.5 rounded-md bg-emerald-100/90 text-emerald-950 font-bold border border-emerald-300/70 text-[11px] sm:text-xs shadow-2xs leading-none"
          >
            {rawBold}
          </span>
        );
      } else if (STATUS_HARAM.test(rawBold)) {
        elements.push(
          <span
            key={`bold-hukum-${keyCounter++}`}
            className="inline-block px-1.5 py-0.2 mx-0.5 rounded-md bg-rose-100/90 text-rose-950 font-bold border border-rose-300/70 text-[11px] sm:text-xs shadow-2xs leading-none"
          >
            {rawBold}
          </span>
        );
      } else if (STATUS_WAJIB.test(rawBold)) {
        elements.push(
          <span
            key={`bold-hukum-${keyCounter++}`}
            className="inline-block px-1.5 py-0.2 mx-0.5 rounded-md bg-amber-100/90 text-amber-950 font-bold border border-amber-300/70 text-[11px] sm:text-xs shadow-2xs leading-none"
          >
            {rawBold}
          </span>
        );
      } else if (STATUS_MAKRUH.test(rawBold)) {
        elements.push(
          <span
            key={`bold-hukum-${keyCounter++}`}
            className="inline-block px-1.5 py-0.2 mx-0.5 rounded-md bg-stone-200/90 text-stone-900 font-bold border border-stone-300/70 text-[11px] sm:text-xs shadow-2xs leading-none"
          >
            {rawBold}
          </span>
        );
      } else if (STATUS_SUNNAH.test(rawBold)) {
        elements.push(
          <span
            key={`bold-hukum-${keyCounter++}`}
            className="inline-block px-1.5 py-0.2 mx-0.5 rounded-md bg-teal-100/90 text-teal-950 font-bold border border-teal-300/70 text-[11px] sm:text-xs shadow-2xs leading-none"
          >
            {rawBold}
          </span>
        );
      } else {
        elements.push(
          <strong
            key={`bold-${keyCounter++}`}
            className="font-bold text-[#1E3F30] tracking-normal"
          >
            {rawBold}
          </strong>
        );
      }
    } else if (isItalic) {
      const rawItalic = italicTextStar || italicTextUnder || "";
      elements.push(
        <em key={`italic-${keyCounter++}`} className="italic text-stone-700">
          {rawItalic}
        </em>
      );
    } else if (isCode && codeText) {
      elements.push(
        <code
          key={`code-${keyCounter++}`}
          className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[11px] text-stone-800 border border-stone-200"
        >
          {codeText}
        </code>
      );
    } else {
      elements.push(fullMatch);
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  // Sisa teks setelah match terakhir
  if (lastIndex < text.length) {
    let remainder = text.substring(lastIndex);
    // Bersihkan asterik gantung di ujung teks jika terjadi pemotongan streaming
    remainder = remainder.replace(/\*\*+/g, "");
    elements.push(remainder);
  }

  return elements;
}

interface BlockItem {
  type:
    | "kesimpulan"
    | "heading"
    | "subheading"
    | "ul"
    | "ol"
    | "blockquote"
    | "arabic"
    | "footnote"
    | "paragraph";
  headingText?: string;
  items?: string[];
  content: string;
}

export function FormatJawabanMochi({
  content,
  isStreaming = false,
}: FormatJawabanMochiProps) {
  const blocks = useMemo(() => {
    if (!content) return [];

    let raw = content.trim();

    // Pisahkan catatan kaki / penafian di bagian bawah (jika dihasilkan oleh LLM)
    let footnoteContent: string | null = null;
    const disclaimerSplit = raw.split(/\n\s*---\s*\n|\n\s*\*\s*---\s*\*\s*\n/);
    if (disclaimerSplit.length > 1) {
      raw = disclaimerSplit[0].trim();
      const rawFootnote = disclaimerSplit.slice(1).join("\n").trim();
      // Bersihkan dekorasi markdown berlebih dari penafian
      const cleanFootnote = rawFootnote
        .replace(/^[*_~]+|[*_~]+$/g, "")
        .replace(/^[⚠️\s*]+/, "")
        .replace(/^\*\*Catatan Penting:\*\*\s*/i, "")
        .replace(/^Catatan Penting:\s*/i, "")
        .replace(/\*\*/g, "")
        .trim();
      if (cleanFootnote) {
        footnoteContent = cleanFootnote;
      }
    }

    // Split teks per baris untuk memetakan blok terstruktur
    const lines = raw.split("\n");
    const parsedBlocks: BlockItem[] = [];

    let currentListType: "ul" | "ol" | null = null;
    let currentListItems: string[] = [];
    let currentParagraphLines: string[] = [];

    const flushParagraph = () => {
      if (currentParagraphLines.length > 0) {
        const pText = currentParagraphLines.join("\n").trim();
        if (pText) {
          // Cek apakah ini blok Arab
          if (isTeksArab(pText)) {
            parsedBlocks.push({ type: "arabic", content: pText });
          } else {
            // Cek apakah blok ini diawali Kesimpulan / Keputusan
            const matchKesimpulan = pText.match(
              /^(\*{1,2}|#{1,4}\s*)?(kesimpulan|keputusan|inti hukum|rangkuman)(\s*forum)?(?::\*{1,2}|\*{1,2}:?|:)?\s*([\s\S]*)$/i
            );
            if (matchKesimpulan && matchKesimpulan[4]) {
              parsedBlocks.push({
                type: "kesimpulan",
                content: matchKesimpulan[4].trim(),
              });
            } else {
              parsedBlocks.push({ type: "paragraph", content: pText });
            }
          }
        }
        currentParagraphLines = [];
      }
    };

    const flushList = () => {
      if (currentListType && currentListItems.length > 0) {
        parsedBlocks.push({
          type: currentListType,
          items: [...currentListItems],
          content: "",
        });
        currentListItems = [];
        currentListType = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Baris kosong memicu flush
      if (!trimmed) {
        flushParagraph();
        flushList();
        continue;
      }

      // 1. Heading (#, ##, ###)
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        flushParagraph();
        flushList();
        const level = headingMatch[1].length;
        const text = headingMatch[2].replace(/\*\*/g, "").trim();
        parsedBlocks.push({
          type: level <= 2 ? "heading" : "subheading",
          content: text,
        });
        continue;
      }

      // 2. Deteksi Blok Kesimpulan / Keputusan khusus baris mandiri (misal: **Kesimpulan:**)
      const kesimpulanHeaderMatch = trimmed.match(
        /^(\*{1,2}|#{1,4}\s*)?(kesimpulan|keputusan|inti hukum|rangkuman)(\s*forum)?(?::\*{1,2}|\*{1,2}:?|:)?\s*$/i
      );
      if (kesimpulanHeaderMatch) {
        flushParagraph();
        flushList();
        // Ambil isi paragraf berikutnya sebagai kesimpulan
        let kesimpulanText = "";
        let j = i + 1;
        while (j < lines.length && lines[j].trim()) {
          kesimpulanText += (kesimpulanText ? "\n" : "") + lines[j].trim();
          j++;
        }
        if (kesimpulanText) {
          parsedBlocks.push({
            type: "kesimpulan",
            content: kesimpulanText,
          });
          i = j - 1; // Lompat ke baris terakhir yang sudah diproses
          continue;
        }
      }

      // 3. Unordered list (- item, * item, • item)
      const ulMatch = trimmed.match(/^[-*•]\s+(.+)$/);
      if (ulMatch) {
        flushParagraph();
        if (currentListType !== "ul") {
          flushList();
          currentListType = "ul";
        }
        currentListItems.push(ulMatch[1]);
        continue;
      }

      // 4. Ordered list (1. item, 2. item)
      const olMatch = trimmed.match(/^\d+[\.)]\s+(.+)$/);
      if (olMatch) {
        flushParagraph();
        if (currentListType !== "ol") {
          flushList();
          currentListType = "ol";
        }
        currentListItems.push(olMatch[1]);
        continue;
      }

      // 5. Blockquote (> kutipan)
      const bqMatch = trimmed.match(/^>\s*(.+)$/);
      if (bqMatch) {
        flushParagraph();
        flushList();
        parsedBlocks.push({
          type: "blockquote",
          content: bqMatch[1],
        });
        continue;
      }

      // 6. Jika masih dalam list tapi baris ini bukan list marker, flush list
      if (currentListType) {
        flushList();
      }

      // Baris teks biasa
      currentParagraphLines.push(line);
    }

    // Flush sisa
    flushParagraph();
    flushList();

    // Masukkan footnote jika ada
    if (footnoteContent) {
      parsedBlocks.push({
        type: "footnote",
        content: footnoteContent,
      });
    }

    return parsedBlocks;
  }, [content]);

  if (!content) return null;

  return (
    <div className="space-y-3 text-stone-800 text-xs sm:text-sm leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "kesimpulan":
            return (
              <div
                key={`kesimpulan-${idx}`}
                className="my-2.5 rounded-xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-white p-3.5 sm:p-4 text-xs sm:text-sm text-stone-900 shadow-2xs"
              >
                <div className="flex items-center gap-1.5 font-bold tracking-wide text-[#1E3F30] text-[11px] sm:text-xs uppercase mb-2">
                  <Scale className="h-4 w-4 shrink-0 text-[#1E3F30]" />
                  <span>KESIMPULAN HUKUM</span>
                  <span className="ml-auto rounded-full bg-emerald-100/90 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-bold text-[#1E3F30]">
                    Ketetapan
                  </span>
                </div>
                <div className="leading-relaxed text-stone-800 font-normal">
                  {parseInline(block.content)}
                </div>
              </div>
            );

          case "heading":
            return (
              <h3
                key={`h-${idx}`}
                className="mt-3.5 mb-1.5 flex items-center gap-1.5 font-bold text-[#1E3F30] text-xs sm:text-sm border-b border-stone-200/80 pb-1"
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                <span>{parseInline(block.content)}</span>
              </h3>
            );

          case "subheading":
            return (
              <h4
                key={`sh-${idx}`}
                className="mt-2.5 mb-1 flex items-center gap-1.5 font-bold text-stone-900 text-xs sm:text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A96E]" />
                <span>{parseInline(block.content)}</span>
              </h4>
            );

          case "ul":
            return (
              <ul key={`ul-${idx}`} className="my-2 space-y-1.5 pl-0.5">
                {(block.items || []).map((item, itemIdx) => (
                  <li
                    key={`ul-item-${itemIdx}`}
                    className="flex items-start gap-2 leading-relaxed"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E3F30]" />
                    <span className="flex-1">{parseInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={`ol-${idx}`} className="my-2 space-y-2 pl-0.5">
                {(block.items || []).map((item, itemIdx) => (
                  <li
                    key={`ol-item-${itemIdx}`}
                    className="flex items-start gap-2 leading-relaxed"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1E3F30]/10 border border-[#1E3F30]/25 text-[10px] font-bold text-[#1E3F30]">
                      {itemIdx + 1}
                    </span>
                    <span className="flex-1">{parseInline(item)}</span>
                  </li>
                ))}
              </ol>
            );

          case "arabic":
            return (
              <div
                key={`ar-${idx}`}
                dir="rtl"
                className="my-2.5 rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 sm:p-3.5 font-arabic text-base sm:text-lg leading-loose text-stone-900 shadow-2xs text-right"
              >
                {block.content}
              </div>
            );

          case "blockquote":
            return (
              <blockquote
                key={`bq-${idx}`}
                className="my-2 rounded-r-xl border-l-3 border-[#1E3F30]/50 bg-stone-50/80 py-1.5 pl-3 pr-2 italic text-stone-700 text-xs sm:text-sm"
              >
                {parseInline(block.content)}
              </blockquote>
            );

          case "footnote":
            return (
              <div
                key={`fn-${idx}`}
                className="mt-3 rounded-xl border border-stone-200/80 bg-stone-50/70 p-2.5 sm:p-3 text-[11px] leading-relaxed text-stone-600 flex items-start gap-2 shadow-2xs"
              >
                <Info className="h-3.5 w-3.5 shrink-0 text-stone-500 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-stone-700 block mb-0.5">
                    Catatan Rujukan:
                  </span>
                  {parseInline(block.content)}
                </div>
              </div>
            );

          case "paragraph":
          default:
            return (
              <p
                key={`p-${idx}`}
                className="leading-relaxed text-stone-800"
              >
                {parseInline(block.content)}
              </p>
            );
        }
      })}

      {/* Indikator kursor jika masih streaming token aktif */}
      {isStreaming && (
        <span className="inline-block h-3.5 w-1.5 animate-pulse rounded-xs bg-[#1E3F30] ml-0.5 align-middle" />
      )}
    </div>
  );
}
