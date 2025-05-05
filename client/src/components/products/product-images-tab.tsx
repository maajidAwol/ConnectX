"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadImageArea } from "./upload-image-area"

interface ProductImagesTabProps {
  images: Array<{ file: File; preview: string; uploading?: boolean }>
  onAddImage: (files: FileList) => void
  onRemoveImage: (index: number) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export function ProductImagesTab({ images, onAddImage, onRemoveImage, fileInputRef }: ProductImagesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>Upload high-quality images of your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <UploadImageArea
          images={images}
          onAddImage={onAddImage}
          onRemoveImage={onRemoveImage}
          fileInputRef={fileInputRef}
        />
      </CardContent>
    </Card>
  )
}
