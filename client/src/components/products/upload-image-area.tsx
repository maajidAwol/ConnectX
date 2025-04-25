"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { type File, Loader2, UploadCloud, X } from "lucide-react"

interface UploadImageAreaProps {
  images: Array<{ file: File; preview: string; uploading?: boolean }>
  onAddImage: (files: FileList) => void
  onRemoveImage: (index: number) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export function UploadImageArea({ images, onAddImage, onRemoveImage, fileInputRef }: UploadImageAreaProps) {
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && onAddImage(e.target.files)}
      />

      <div
        onClick={triggerFileInput}
        className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
      >
        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="font-medium">Click to upload images</p>
        <p className="text-sm text-muted-foreground">PNG, JPG or WEBP (max 5MB per image)</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {images.map((image, index) => (
            <div key={index} className="relative group rounded-md overflow-hidden border">
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.preview || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              {image.uploading ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              ) : (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-red-500 hover:bg-red-600"
                    onClick={() => onRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {index === 0 && !image.uploading && (
                <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs py-1 text-center">
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
