'use client';

import { useState, useEffect } from 'react';
import type { CuratedImage } from '@/types';
import Image from 'next/image';

export default function AdminImagesPage() {
  const [images, setImages] = useState<CuratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('url');

  const [occasion, setOccasion] = useState('birthday');
  const [mood, setMood] = useState('gentle');
  const [style, setStyle] = useState('watercolor');
  const [midjourneyPrompt, setMidjourneyPrompt] = useState('');
  const [tags, setTags] = useState('');
  const [autoTags, setAutoTags] = useState<string[]>([]);
  const [isGeneratingAITags, setIsGeneratingAITags] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  // Extract keywords from MidJourney prompt
  const extractKeywords = (prompt: string): string[] => {
    if (!prompt) return [];

    // Comprehensive stop words - filter out generic/common words
    const stopWords = new Set([
      // Articles, prepositions, conjunctions
      'a', 'an', 'and', 'the', 'with', 'for', 'in', 'on', 'at', 'to', 'of', 'by', 'from', 'or',
      // Generic quality descriptors
      'high', 'quality', 'beautiful', 'elegant', 'stunning', 'amazing', 'gorgeous',
      'professional', 'detailed', 'intricate', 'perfect', 'exquisite', 'delicate',
      'lovely', 'pretty', 'nice', 'good', 'great', 'best', 'fine', 'excellent',
      // Generic art/image terms
      'art', 'artwork', 'image', 'picture', 'photo', 'photograph', 'painting',
      'illustration', 'design', 'style', 'composition', 'scene', 'view',
      'render', 'rendering', 'digital', 'graphic', 'visual', 'aesthetic',
      // Size/quality technical terms
      '4k', '8k', 'hd', 'uhd', 'ultra', 'resolution', 'sharp', 'crisp',
      // Generic mood/atmosphere
      'atmosphere', 'mood', 'feeling', 'tone', 'vibe', 'energy',
      // Common MidJourney phrases
      'highly', 'very', 'extremely', 'super', 'hyper', 'realistic', 'photorealistic',
      // Aspect ratios
      '--ar', '5:7', '16:9', '4:3', '2:3', '3:2', '1:1',
    ]);

    // Extract words, remove punctuation, lowercase
    const words = prompt
      .toLowerCase()
      .replace(/--\w+\s+[\d:]+/g, '') // Remove MJ parameters like --ar 5:7
      .replace(/--\w+/g, '') // Remove other MJ flags
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates

    // Limit to top 7 most meaningful words (concrete nouns preferred)
    return words.slice(0, 7);
  };

  // Auto-extract keywords when prompt changes
  useEffect(() => {
    if (midjourneyPrompt) {
      const keywords = extractKeywords(midjourneyPrompt);
      setAutoTags(keywords);
      // Only auto-populate if tags field is empty
      if (!tags) {
        setTags(keywords.join(', '));
      }
    } else {
      setAutoTags([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midjourneyPrompt]);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const password = localStorage.getItem('adminPassword');
      const response = await fetch('/api/admin/curated-images', {
        headers: {
          'x-admin-password': password || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !imageUrl) return;

    setIsUploading(true);
    try {
      const password = localStorage.getItem('adminPassword');
      const formData = new FormData();

      if (uploadMethod === 'url' && imageUrl) {
        // Fetch the image client-side to bypass CORS/403 issues
        try {
          const imageResponse = await fetch(imageUrl);
          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch: ${imageResponse.status}`);
          }
          const imageBlob = await imageResponse.blob();

          // Convert blob to file
          const fileName = `midjourney-${Date.now()}.${imageBlob.type.split('/')[1] || 'jpg'}`;
          const imageFile = new File([imageBlob], fileName, { type: imageBlob.type });

          formData.append('file', imageFile);
        } catch (fetchError) {
          alert(`Failed to fetch image from URL: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
          setIsUploading(false);
          return;
        }
      } else if (file) {
        formData.append('file', file);
      }

      formData.append('occasion', occasion);
      formData.append('mood', mood);
      formData.append('style', style);
      formData.append('midjourneyPrompt', midjourneyPrompt);
      formData.append('tags', tags);

      const response = await fetch('/api/admin/curated-images', {
        method: 'POST',
        headers: {
          'x-admin-password': password || '',
        },
        body: formData,
      });

      if (response.ok) {
        alert('Image uploaded successfully!');
        setFile(null);
        setImageUrl('');
        setPreview(null);
        setMidjourneyPrompt('');
        setTags('');
        fetchImages();
      } else {
        const data = await response.json();
        alert(`Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const password = localStorage.getItem('adminPassword');
      const response = await fetch(`/api/admin/curated-images?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': password || '',
        },
      });

      if (response.ok) {
        alert('Image deleted');
        fetchImages();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleInitDatabase = async () => {
    if (!confirm('Initialize database tables? (Safe to run multiple times)')) return;

    try {
      const password = localStorage.getItem('adminPassword');
      const response = await fetch('/api/admin/init-db', {
        method: 'POST',
        headers: {
          'x-admin-password': password || '',
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert('Database initialized successfully!');
        fetchImages();
      } else {
        alert(`Database init failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Database init error:', error);
      alert('Database init failed');
    }
  };

  const handleGenerateAITags = async () => {
    if (!preview && !imageUrl) {
      alert('Please select or upload an image first');
      return;
    }

    setIsGeneratingAITags(true);
    try {
      const imageToAnalyze = preview || imageUrl;

      const response = await fetch('/api/admin/generate-ai-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageToAnalyze }),
      });

      const data = await response.json();
      if (response.ok && data.tags) {
        // Merge AI tags with existing tags
        const existingTags = tags.split(',').map(t => t.trim()).filter(Boolean);
        const allTags = [...new Set([...existingTags, ...data.tags])];
        setTags(allTags.join(', '));
        alert(`Added ${data.tags.length} AI-generated tags!`);
      } else {
        alert(`AI tag generation failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('AI tag generation error:', error);
      alert('AI tag generation failed');
    } finally {
      setIsGeneratingAITags(false);
    }
  };

  return (
    <div className="min-h-screen bg-whisper-parchment p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-cormorant font-light text-whisper-inkBlack mb-2">
              Curated Image Library
            </h1>
            <p className="text-whisper-plum/70 font-cormorant">
              Upload and manage MidJourney-generated images for your card collection
            </p>
          </div>
          <button
            onClick={handleInitDatabase}
            className="px-4 py-2 rounded-lg border border-whisper-plum/30 text-whisper-plum font-cormorant text-sm hover:bg-whisper-plum/10 transition-colors"
          >
            Initialize Database
          </button>
        </div>

        {/* Upload Form */}
        <div className="paper-card p-8 mb-8">
          <h2 className="text-2xl font-cormorant font-light text-whisper-inkBlack mb-6">
            Upload New Image
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-cormorant text-whisper-plum mb-2">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-whisper-plum/20 font-cormorant"
                >
                  <option value="birthday">Birthday</option>
                  <option value="comfort">Comfort</option>
                  <option value="gratitude">Gratitude</option>
                  <option value="faith">Faith</option>
                  <option value="celebration">Celebration</option>
                  <option value="sympathy">Sympathy</option>
                  <option value="love">Love</option>
                  <option value="encouragement">Encouragement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-cormorant text-whisper-plum mb-2">
                  Mood
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-whisper-plum/20 font-cormorant"
                >
                  <option value="gentle">Gentle</option>
                  <option value="playful">Playful</option>
                  <option value="hopeful">Hopeful</option>
                  <option value="reflective">Reflective</option>
                  <option value="warm">Warm</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="joyful">Joyful</option>
                  <option value="lighthearted">Lighthearted</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-cormorant text-whisper-plum mb-2">
                  Art Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-whisper-plum/20 font-cormorant"
                >
                  <option value="floral-line-art">Floral Line Art</option>
                  <option value="watercolor">Watercolor</option>
                  <option value="botanical">Botanical</option>
                  <option value="boho">Boho</option>
                  <option value="vintage">Vintage</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="impressionist">Impressionist</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-cormorant text-whisper-plum mb-2">
                MidJourney Prompt (Optional)
              </label>
              <textarea
                value={midjourneyPrompt}
                onChange={(e) => setMidjourneyPrompt(e.target.value)}
                placeholder="elegant watercolor painting, soft colors..."
                className="w-full px-4 py-2 rounded-lg border border-whisper-plum/20 font-cormorant"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-cormorant text-whisper-plum">
                  Tags (comma separated)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateAITags}
                  disabled={isGeneratingAITags || (!preview && !imageUrl)}
                  className="px-3 py-1 text-xs rounded-lg bg-whisper-gold/20 text-whisper-inkBlack font-cormorant hover:bg-whisper-gold/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingAITags ? '✨ Analyzing...' : '✨ Generate AI Tags'}
                </button>
              </div>
              {autoTags.length > 0 && (
                <p className="text-xs text-whisper-plum/60 mb-2 font-cormorant italic">
                  Auto-extracted: {autoTags.join(', ')}
                </p>
              )}
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add more tags or edit auto-extracted ones..."
                className="w-full px-4 py-2 rounded-lg border border-whisper-plum/20 font-cormorant"
              />
              <p className="text-xs text-whisper-inkBlack/50 mt-1 font-cormorant">
                Tags are auto-extracted from your MidJourney prompt. Click "Generate AI Tags" for AI-powered analysis.
              </p>
            </div>

            <div>
              <label className="block text-sm font-cormorant text-whisper-plum mb-4">
                Image Source
              </label>

              {/* Upload Method Toggle */}
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod('url');
                    setFile(null);
                    setPreview(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-cormorant transition-all ${
                    uploadMethod === 'url'
                      ? 'bg-whisper-plum text-whisper-parchment'
                      : 'bg-whisper-parchment border border-whisper-plum/20 text-whisper-inkBlack hover:border-whisper-plum/40'
                  }`}
                >
                  MidJourney URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod('file');
                    setImageUrl('');
                    setPreview(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-cormorant transition-all ${
                    uploadMethod === 'file'
                      ? 'bg-whisper-plum text-whisper-parchment'
                      : 'bg-whisper-parchment border border-whisper-plum/20 text-whisper-inkBlack hover:border-whisper-plum/40'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {/* URL Input */}
              {uploadMethod === 'url' && (
                <div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setPreview(e.target.value || null);
                    }}
                    placeholder="https://cdn.midjourney.com/..."
                    className="w-full px-4 py-3 rounded-lg border border-whisper-plum/20 font-cormorant mb-4"
                  />
                  {imageUrl && (
                    <div className="relative">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        width={200}
                        height={280}
                        className="rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          setPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <>
                  {!preview ? (
                    <label className="block border-2 border-dashed border-whisper-plum/20 rounded-lg p-8 text-center cursor-pointer hover:border-whisper-plum/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <p className="font-cormorant text-whisper-inkBlack/70">
                        Click to upload image
                      </p>
                    </label>
                  ) : (
                    <div className="relative">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={200}
                        height={280}
                        className="rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                        }}
                        className="mt-2 text-sm font-cormorant text-whisper-plum/70 hover:text-whisper-plum block mx-auto"
                      >
                        Change image
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={(!file && !imageUrl) || isUploading}
              className={`
                w-full py-3 rounded-full font-cormorant text-lg
                ${
                  (file || imageUrl) && !isUploading
                    ? 'bg-whisper-plum text-whisper-parchment hover-shimmer'
                    : 'bg-whisper-sage/20 text-whisper-plum/40 cursor-not-allowed'
                }
              `}
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Image Library */}
        <div className="paper-card p-8">
          <h2 className="text-2xl font-cormorant font-light text-whisper-inkBlack mb-6">
            Image Library ({images.length} images)
          </h2>

          {isLoading ? (
            <p className="text-center py-12 font-cormorant text-whisper-plum/60">
              Loading images...
            </p>
          ) : images.length === 0 ? (
            <p className="text-center py-12 font-cormorant text-whisper-inkBlack/70">
              No images uploaded yet
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="aspect-[5/7] relative rounded-lg overflow-hidden">
                    <Image
                      src={img.blobUrl}
                      alt={`${img.occasion} ${img.mood} ${img.style}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 text-xs font-cormorant text-whisper-inkBlack/60">
                    <p className="capitalize">{img.occasion}</p>
                    <p className="capitalize">{img.mood} • {img.style}</p>
                    <p>Used {img.usageCount} times</p>
                  </div>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
