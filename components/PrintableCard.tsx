'use client';

import Image from 'next/image';
import type { CardDesign } from '@/types';

interface PrintableCardProps {
  design: CardDesign;
}

export default function PrintableCard({ design }: PrintableCardProps) {
  const { image, text, layout } = design;
  const {
    fontFamily,
    signatureFont,
    alignment,
    textPosition,
    overlayStyle,
    frameStyle,
    imageScale = 'full',
    imageVerticalPosition = 'center',
    imageHorizontalPosition = 'center'
  } = layout;

  return (
    <div className="print-only">
      {/* Front of Card */}
      <div className="print-page">
        <div className="card-front">
          {/* Background Image with scale and position */}
          <div className={`card-image-container card-image-v-${imageVerticalPosition} card-image-h-${imageHorizontalPosition}`}>
            <div className={`card-image-wrapper card-image-scale-${imageScale}`}>
              {image.url.startsWith('http') ? (
                <img
                  src={image.url}
                  alt="Card artwork"
                  className="card-image"
                />
              ) : (
                <Image
                  src={image.url}
                  alt="Card artwork"
                  fill
                  className="card-image"
                />
              )}
            </div>
          </div>

          {/* Overlay styles */}
          {overlayStyle === 'gradient' && (
            <>
              {textPosition === 'bottom' && (
                <div className="overlay-gradient overlay-bottom" />
              )}
              {textPosition === 'top' && (
                <div className="overlay-gradient overlay-top" />
              )}
              {textPosition === 'center' && (
                <div className="overlay-gradient overlay-center" />
              )}
            </>
          )}
          {overlayStyle === 'scrim' && (
            <div className="overlay-scrim" />
          )}
          {overlayStyle === 'frame' && (
            <>
              {frameStyle === 'thick' && (
                <div className="frame-thick" />
              )}
              {frameStyle === 'thin' && (
                <div className="frame-thin" />
              )}
              {frameStyle === 'vignette' && (
                <div className="frame-vignette" />
              )}
              {frameStyle === 'corners' && (
                <>
                  <div className="frame-corner frame-corner-tl" />
                  <div className="frame-corner frame-corner-tr" />
                  <div className="frame-corner frame-corner-bl" />
                  <div className="frame-corner frame-corner-br" />
                </>
              )}
            </>
          )}

          {/* Text */}
          <div
            className={`card-text card-text-${textPosition} card-text-${alignment}`}
            style={{
              fontFamily: fontFamily === 'cormorant' ? 'var(--font-cormorant), serif' : 'var(--font-baskerville), serif',
            }}
          >
            <p
              className="card-caption"
              style={{
                textShadow: overlayStyle === 'none'
                  ? '1px 1px 3px rgba(13,11,11,0.8), 0 0 8px rgba(13,11,11,0.6)'
                  : overlayStyle === 'frame' && frameStyle === 'vignette'
                  ? '1px 1px 4px rgba(13,11,11,0.7)'
                  : overlayStyle === 'frame'
                  ? '1px 1px 4px rgba(13,11,11,0.6)'
                  : '1px 1px 3px rgba(13,11,11,0.5)'
              }}
            >
              {text.frontCaption}
            </p>
          </div>
        </div>
      </div>

      {/* Inside of Card */}
      <div className="print-page">
        <div className="card-inside">
          <div className={`card-inside-content card-inside-${alignment}`}>
            <p
              className="card-prose"
              style={{
                fontFamily: fontFamily === 'cormorant' ? 'var(--font-cormorant), serif' : 'var(--font-baskerville), serif'
              }}
            >
              {text.insideProse}
            </p>
            <p
              className="card-signature"
              style={{
                fontFamily:
                  signatureFont === 'greatVibes' ? 'var(--font-great-vibes), cursive' :
                  signatureFont === 'allura' ? 'var(--font-allura), cursive' :
                  signatureFont === 'alexBrush' ? 'var(--font-alex-brush), cursive' :
                  signatureFont === 'pinyonScript' ? 'var(--font-pinyon-script), cursive' :
                  signatureFont === 'sacramento' ? 'var(--font-sacramento), cursive' :
                  'var(--font-dancing-script), cursive',
                whiteSpace: 'pre-line'
              }}
            >
              {text.signature?.replace(',', ',\n')}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .print-only {
          display: none;
        }

        @media print {
          .print-only {
            display: block;
          }

          .print-page {
            page-break-after: always;
            width: 5in;
            height: 7in;
            position: relative;
            margin: 0;
            padding: 0;
          }

          .card-front,
          .card-inside {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            background: #F9F4EE;
          }

          .card-image-container {
            position: absolute;
            inset: 0;
            display: flex;
          }

          /* Vertical positioning */
          .card-image-v-top {
            align-items: flex-start;
          }
          .card-image-v-center {
            align-items: center;
          }
          .card-image-v-bottom {
            align-items: flex-end;
          }

          /* Horizontal positioning */
          .card-image-h-left {
            justify-content: flex-start;
          }
          .card-image-h-center {
            justify-content: center;
          }
          .card-image-h-right {
            justify-content: flex-end;
          }

          /* Image scale */
          .card-image-wrapper {
            position: relative;
          }
          .card-image-scale-small {
            width: 60%;
            height: 60%;
          }
          .card-image-scale-medium {
            width: 80%;
            height: 80%;
          }
          .card-image-scale-large {
            width: 90%;
            height: 90%;
          }
          .card-image-scale-full {
            width: 100%;
            height: 100%;
          }

          .card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }

          /* Overlays */
          .overlay-gradient {
            position: absolute;
            inset: 0;
          }

          .overlay-bottom {
            background: linear-gradient(to top, rgba(13,11,11,0.75) 0%, rgba(13,11,11,0.3) 50%, transparent 100%);
          }

          .overlay-top {
            background: linear-gradient(to bottom, rgba(13,11,11,0.75) 0%, rgba(13,11,11,0.3) 50%, transparent 100%);
          }

          .overlay-center {
            background: radial-gradient(circle, rgba(13,11,11,0.5) 0%, rgba(13,11,11,0.3) 40%, transparent 70%);
          }

          .overlay-scrim {
            position: absolute;
            inset: 0;
            background: rgba(13,11,11,0.45);
          }

          /* Frames */
          .frame-thick {
            position: absolute;
            inset: 0;
            border: 20px solid rgba(249,244,238,0.9);
            box-shadow: inset 0 0 40px rgba(13,11,11,0.3);
          }

          .frame-thin {
            position: absolute;
            inset: 0;
            border: 3px solid rgba(249,244,238,0.95);
            box-shadow: inset 0 0 20px rgba(13,11,11,0.2);
          }

          .frame-vignette {
            position: absolute;
            inset: 0;
            box-shadow: inset 0 0 80px 40px rgba(13,11,11,0.6);
          }

          .frame-corner {
            position: absolute;
            width: 64px;
            height: 64px;
            border: 4px solid rgba(249,244,238,0.9);
          }

          .frame-corner-tl {
            top: 0;
            left: 0;
            border-right: none;
            border-bottom: none;
          }

          .frame-corner-tr {
            top: 0;
            right: 0;
            border-left: none;
            border-bottom: none;
          }

          .frame-corner-bl {
            bottom: 0;
            left: 0;
            border-right: none;
            border-top: none;
          }

          .frame-corner-br {
            bottom: 0;
            right: 0;
            border-left: none;
            border-top: none;
          }

          /* Text positioning */
          .card-text {
            position: absolute;
            left: 0;
            right: 0;
            padding: 0 40px;
            display: flex;
            align-items: center;
          }

          .card-text-bottom {
            bottom: 40px;
          }

          .card-text-top {
            top: 40px;
          }

          .card-text-center {
            top: 50%;
            transform: translateY(-50%);
          }

          .card-text-left {
            justify-content: flex-start;
            text-align: left;
          }

          .card-text-center {
            justify-content: center;
            text-align: center;
          }

          .card-text-right {
            justify-content: flex-end;
            text-align: right;
          }

          .card-caption {
            font-size: 28pt;
            color: #F9F4EE;
            line-height: 1.2;
            white-space: pre-line;
            margin: 0;
          }

          /* Inside card */
          .card-inside {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
          }

          .card-inside-content {
            width: 100%;
          }

          .card-inside-left {
            text-align: left;
          }

          .card-inside-center {
            text-align: center;
          }

          .card-inside-right {
            text-align: right;
          }

          .card-prose {
            font-size: 14pt;
            color: #0D0B0B;
            line-height: 1.6;
            margin-bottom: 32px;
          }

          .card-signature {
            font-size: 32pt;
            color: #5B3E43;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
