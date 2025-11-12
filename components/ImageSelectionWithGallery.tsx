'use client';

import { useState, useEffect } from 'react';
import { useCardStore } from '@/lib/store';
import type { CardImage, CuratedImage } from '@/types';
import Image from 'next/image';

export default function ImageSelection() {
  const intent = useCardStore((state) => state.intent);
  const setImage = useCardStore((state) => state.setImage);
  const setStep = useCardStore((state) => state.setStep);

  const [curatedImages, setCuratedImages] = useState<CuratedImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [selectedCurated, setSelectedCurated] = useState<CuratedImage | null>(null);
  const [showUploadOption, setShowUploadOption] = useState(false);

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!intent) return null;

  // Load curated images matching the user's selections
  useEffect(() => {
    const fetchCuratedImages = async () => {
      setIsLoadingGallery(true);
      try {
        const params = new URLSearchParams({
          occasion: intent.occasion,
          mood: intent.mood,
          style: intent.style,
        });

        const response = await fetch(`/api/curated-images?${params}`);
        const data = await response.json();
        setCuratedImages(data.images || []);
      } catch (error) {
        console.error('Error loading curated images:', error);
      } finally {
        setIsLoadingGallery(false);
      }
    };

    fetchCuratedImages();
  }, [intent.occasion, intent.mood, intent.style]);

  const handleCuratedSelect = (curated: CuratedImage) => {
    setSelectedCurated(curated);
    setImagePreview(curated.blobUrl);
    setUploadedImage(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setSelectedCurated(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    if (!imagePreview) return;

    setIsUploading(true);

    try {
      let blobUrl = imagePreview;

      // If user uploaded custom image, upload to Blob Storage
      if (uploadedImage) {
        const formData = new FormData();
        formData.append('file', uploadedImage);
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        blobUrl = data.url;
      } else if (selectedCurated) {
        // Use curated image URL and increment usage count
        blobUrl = selectedCurated.blobUrl;
      }

      const cardImage: CardImage = {
        id: crypto.randomUUID(),
        url: imagePreview,
        blobUrl: blobUrl,
        prompt: selectedCurated?.midjourneyPrompt || '',
        aspectRatio: '5:7',
        createdAt: new Date(),
      };

      setImage(cardImage);
      setStep(3);
    } catch (error) {
      console.error('Failed to process image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto watermark-whisper">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-cormorant font-light text-whisper-inkBlack mb-4 tracking-wide">
          Choose your artwork
        </h2>
        <p className="text-lg font-cormorant italic text-whisper-plum/70">
          Curated images for your perfect card
        </p>
      </div>

      {/* Selected Intent Summary */}
      <div className="paper-card p-6 mb-12 border-none">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-cormorant text-whisper-inkBlack/60">
          <span>
            <span className="text-whisper-plum">Occasion:</span>{' '}
            <span className="capitalize italic">{intent.occasion}</span>
          </span>
          <span className="text-whisper-plum/30">•</span>
          <span>
            <span className="text-whisper-plum">Mood:</span>{' '}
            <span className="capitalize italic">{intent.mood}</span>
          </span>
          <span className="text-whisper-plum/30">•</span>
          <span>
            <span className="text-whisper-plum">Style:</span>{' '}
            <span className="capitalize italic">{intent.style.replace('-', ' ')}</span>
          </span>
        </div>
      </div>

      {/* Curated Gallery */}
      {!showUploadOption && (
        <div className="paper-card p-8 mb-8">
          <h3 className="text-3xl font-cormorant font-light text-whisper-inkBlack mb-6 text-center">
            Our Collection
          </h3>

          {isLoadingGallery ? (
            <div className="text-center py-12">
              <p className="text-whisper-plum/60 font-cormorant italic">
                Loading beautiful images...
              </p>
            </div>
          ) : curatedImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-whisper-inkBlack/70 font-cormorant mb-4">
                No curated images yet for this combination.
              </p>
              <button
                onClick={() => setShowUploadOption(true)}
                className="px-8 py-3 rounded-full bg-whisper-plum text-whisper-parchment font-cormorant hover-shimmer click-settle"
              >
                Upload Your Own Image
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {curatedImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => handleCuratedSelect(img)}
                    className={`
                      relative aspect-[5/7] rounded-xl overflow-hidden cursor-pointer
                      transition-all duration-200 hover:scale-105
                      ${
                        selectedCurated?.id === img.id
                          ? 'ring-4 ring-whisper-plum shadow-paper-lg'
                          : 'hover:ring-2 hover:ring-whisper-plum/40'
                      }
                    `}
                  >
                    <Image
                      src={img.thumbnailUrl || img.blobUrl}
                      alt={`${img.occasion} ${img.mood} ${img.style}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {selectedCurated?.id === img.id && (
                      <div className="absolute inset-0 bg-whisper-plum/20 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-whisper-plum text-whisper-parchment flex items-center justify-center">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowUploadOption(true)}
                  className="font-cormorant text-whisper-plum/70 hover:text-whisper-plum text-sm hover-shimmer italic"
                >
                  Or upload your own image
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Upload Option */}
      {showUploadOption && (
        <div className="paper-card p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-cormorant font-light text-whisper-inkBlack">
              Upload Your Image
            </h3>
            {curatedImages.length > 0 && (
              <button
                onClick={() => {
                  setShowUploadOption(false);
                  setUploadedImage(null);
                  setImagePreview(selectedCurated?.blobUrl || null);
                }}
                className="font-cormorant text-whisper-plum/70 hover:text-whisper-plum text-sm hover-shimmer italic"
              >
                ← Back to gallery
              </button>
            )}
          </div>

          {!imagePreview || selectedCurated ? (
            <label className="block border-2 border-dashed border-whisper-plum/20 rounded-2xl p-12 text-center cursor-pointer hover:border-whisper-plum/40 hover:bg-whisper-blushRose/10 transition-all duration-150 hover-shimmer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="text-whisper-inkBlack/50">
                <svg
                  className="mx-auto h-12 w-12 mb-4 text-whisper-plum/40"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  strokeWidth={1.5}
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-lg font-cormorant mb-1 text-whisper-inkBlack/70">
                  Upload from computer
                </p>
                <p className="text-sm font-cormorant italic text-whisper-plum/60">
                  PNG or JPG, up to 10MB
                </p>
              </div>
            </label>
          ) : (
            <div>
              <div className="relative w-full max-w-md mx-auto mb-6">
                <Image
                  src={imagePreview}
                  alt="Selected image"
                  width={400}
                  height={560}
                  className="rounded-2xl shadow-paper-lg"
                />
              </div>
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setImagePreview(null);
                }}
                className="font-cormorant text-whisper-plum/70 hover:text-whisper-plum text-sm mb-4 block mx-auto hover-shimmer italic"
              >
                Choose a different image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between mt-12">
        <button
          onClick={handleBack}
          className="px-10 py-3 rounded-full border-2 border-whisper-plum/30 font-cormorant text-whisper-inkBlack hover:bg-whisper-plum/10 hover:border-whisper-plum/50 transition-all duration-150 hover-shimmer click-settle"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!imagePreview || isUploading}
          className={`
            px-12 py-4 rounded-full font-cormorant text-lg transition-all duration-150
            ${
              imagePreview && !isUploading
                ? 'bg-whisper-plum text-whisper-parchment hover-shimmer click-settle shadow-paper-lg glow-soft'
                : 'bg-whisper-sage/20 text-whisper-plum/40 cursor-not-allowed'
            }
          `}
        >
          {isUploading ? 'Preparing your image...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
