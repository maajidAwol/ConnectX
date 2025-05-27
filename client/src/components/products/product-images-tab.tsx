"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadImageArea } from "./upload-image-area"

interface ProductImagesTabProps {
  coverImage: { file?: File; preview: string; uploading?: boolean; existing?: boolean } | null
  images: Array<{ file?: File; preview: string; uploading?: boolean; existing?: boolean }>
  onAddCoverImage: (files: FileList) => void
  onRemoveCoverImage: () => void
  onAddImage: (files: FileList) => void
  onRemoveImage: (index: number) => void
  coverImageInputRef: React.RefObject<HTMLInputElement>
  fileInputRef: React.RefObject<HTMLInputElement>
  errors: {
    cover_url?: string
  }
}

export function ProductImagesTab({
  coverImage,
  images,
  onAddCoverImage,
  onRemoveCoverImage,
  onAddImage,
  onRemoveImage,
  coverImageInputRef,
  fileInputRef,
  errors,
}: ProductImagesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
          <CardDescription>Upload a main image for your product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coverImage ? (
              <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-lg border">
                <img
                  src={coverImage.preview}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
                {coverImage.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                  </div>
                )}
                <button
                  onClick={onRemoveCoverImage}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                  <input
                    type="file"
                    ref={coverImageInputRef}
                    onChange={(e) => e.target.files && onAddCoverImage(e.target.files)}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => coverImageInputRef.current?.click()}
                    className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                      errors.cover_url ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Upload Cover Image
                  </button>
                  <p className="mt-2 text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  {errors.cover_url && (
                    <p className="mt-2 text-sm text-red-500">{errors.cover_url}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>Upload additional images of your product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                <img
                  src={image.preview}
                  alt={`Product ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {image.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                  </div>
                )}
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && onAddImage(e.target.files)}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Add Images
                </button>
                <p className="mt-2 text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
