"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Step, StepStatus } from "@/components/ui/step"
import { ArrowLeft, type File as LucideFile, CheckCircle, Circle, XCircle, Loader2 } from "lucide-react"
import { ProductBasicInfoTab } from "@/components/products/product-basic-info-tab"
import { ProductDetailsTab } from "@/components/products/product-details-tab"
import { ProductImagesTab } from "@/components/products/product-images-tab"
import { ProductOptionsTab } from "@/components/products/product-options-tab"
import { FormSuccessAlert } from "@/components/products/form-success-alert"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import useProductStore from "@/store/useProductStore"
import useCategoryStore from "@/store/useCategoryStore"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { useTenantStore } from "@/store/tenantStore"

interface FormErrors {
  name?: string
  sku?: string
  category_id?: string
  description?: string
  base_price?: string
  quantity?: string
  cover_url?: string
}

interface SubmitData {
  name: string
  base_price: string
  quantity: number
  category_id: string
  description: string
  short_description: string
  brand: string
  warranty: string
  is_public: boolean
  tag: string[]
  colors: string[]
  sizes: string[]
  additional_info: Record<string, string>
  cover_image_upload?: File
  images_upload?: File[]
}

interface ImageState {
  file?: File
  preview: string
  uploading?: boolean
  existing?: boolean
}

export default function ProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const isEditMode = !!productId
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [stepsStatus, setStepsStatus] = useState<StepStatus[]>([
    "current", // Basic Info
    "upcoming", // Details
    "upcoming", // Images
    "upcoming"  // Options
  ])
  const [coverImage, setCoverImage] = useState<ImageState | null>(null)
  const [images, setImages] = useState<ImageState[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null!)
  const coverImageInputRef = useRef<HTMLInputElement>(null!)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    base_price: "",
    quantity: "",
    category_id: "",
    description: "",
    short_description: "",
    tag: [] as string[],
    brand: "",
    additional_info: {} as Record<string, string>,
    warranty: "",
    is_public: true,
    colors: [] as string[],
    sizes: [] as string[],
  })

  const { createProduct, updateProduct, getProductById } = useProductStore((state: any) => state)
  const { categories, fetchCategories, isLoading: isCategoriesLoading } = useCategoryStore()
  const { isTenantVerified } = useAuthStore()
  const { tenantData} = useTenantStore()
  // const isVerified = isTenantVerified()
  const isVerified = tenantData?.is_verified || false
  
  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Fetch product data if in edit mode
  useEffect(() => {
    const fetchProductData = async () => {
      if (isEditMode && productId) {
        try {
          setIsLoading(true)
          const product = await getProductById(productId)
          
          // Set form data from product
          setFormData({
            name: product.name || "",
            base_price: product.base_price?.toString() || "",
            quantity: product.quantity?.toString() || "",
            category_id: product.category?.id || "",
            description: product.description || "",
            short_description: product.short_description || "",
            tag: product.tag || [],
            brand: product.brand || "",
            additional_info: product.additional_info || {},
            warranty: product.warranty || "",
            is_public: product.is_public ?? true,
            colors: product.colors || [],
            sizes: product.sizes || [],
          })
          
          // Set cover image
          if (product.cover_url) {
            setCoverImage({
              preview: product.cover_url,
              existing: true
            })
          }
          
          // Set product images
          if (product.images && product.images.length > 0) {
            setImages(product.images.map((imageUrl: string) => ({
              preview: imageUrl,
              existing: true
            })))
          }
          
        } catch (error) {
          console.error("Error fetching product data:", error)
          toast.error("Failed to load product data")
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    fetchProductData()
  }, [productId, isEditMode, getProductById])

  // Define steps
  const steps = [
    { title: "Basic Info", description: "Product name, SKU, category" },
    { title: "Details", description: "Price, quantity, specifications" },
    { title: "Images", description: "Cover image and additional photos" },
    { title: "Options", description: "Colors, sizes, visibility" }
  ]

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle additional info changes
  const handleAdditionalInfoChange = (key: string, value: string) => {
    console.log(`Updating additional_info.${key} to "${value}"`);
    
    setFormData((prev) => {
      const newAdditionalInfo = { ...prev.additional_info };
      
      if (value === "") {
        // If value is empty, remove the key
        delete newAdditionalInfo[key];
      } else {
        // Otherwise, update or add the key-value pair
        newAdditionalInfo[key] = value;
      }
      
      // Log the updated additional_info object
      console.log("Updated additional_info:", newAdditionalInfo);
      
      return {
        ...prev,
        additional_info: newAdditionalInfo,
      };
    });
  }

  // Handle array field changes (tags, colors, sizes)
  const handleArrayFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()),
    }))
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  // Handle cover image selection
  const handleCoverImageSelect = (files: FileList) => {
    if (files && files.length > 0) {
      const file = files[0]
      setCoverImage({
        file,
        preview: URL.createObjectURL(file),
        uploading: true,
        existing: false
      })

      // Simulate upload completion after a delay
      setTimeout(() => {
        setCoverImage((prev) => prev ? { ...prev, uploading: false } : null)
      }, 1500)
    }

    // Clear the input to allow selecting the same file again
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = ""
    }
  }

  // Remove cover image
  const removeCoverImage = () => {
    if (coverImage) {
      if (!coverImage.existing && coverImage.preview) {
        URL.revokeObjectURL(coverImage.preview)
      }
      setCoverImage(null)
    }
  }

  // Handle file selection
  const handleImageSelect = (files: FileList) => {
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: true,
        existing: false
      }))

      setImages((prevImages) => [...prevImages, ...newImages])

      // Simulate upload completion after a delay
      setTimeout(() => {
        setImages((prevImages) =>
          prevImages.map((img) => ({
            ...img,
            uploading: false,
          })),
        )
      }, 1500)
    }

    // Clear the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages]
      // Revoke the object URL to prevent memory leaks
      if (!updatedImages[index].existing && updatedImages[index].preview) {
        URL.revokeObjectURL(updatedImages[index].preview)
      }
      updatedImages.splice(index, 1)
      return updatedImages
    })
  }

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    // Validation logic for each step
    if (step === 0) { // Basic Info
      if (!formData.name.trim()) newErrors.name = "Product name is required";
      if (!formData.category_id) newErrors.category_id = "Category is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
    } 
    else if (step === 1) { // Details
      if (!formData.base_price) newErrors.base_price = "Base price is required";
      if (!formData.quantity) newErrors.quantity = "Quantity is required";
    }
    else if (step === 2) { // Images
      if (!coverImage) newErrors.cover_url = "Cover image is required";
    }
    
    // Set errors
    setErrors(newErrors);
    
    // Log validation result
    const isValid = Object.keys(newErrors).length === 0;
    
    return isValid;
  }

  // Move to next step with validation
  const goToNextStep = () => {
    console.log("Current form data:", formData);
    
    // First validate current step
    if (validateStep(currentStep)) {
      
      // Update current step status to completed
      const newStepsStatus = [...stepsStatus];
      newStepsStatus[currentStep] = "complete";
      
      // Set next step as current
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        
        newStepsStatus[nextStep] = "current";
        setStepsStatus(newStepsStatus);
        setCurrentStep(nextStep);
        // Clear any errors
        setErrors({});
      }
    } else {
      console.log("Validation failed for current step");
    }
  }

  // Go to previous step
  const goToPreviousStep = () => {
    console.log("Current form data:", formData);
    console.log("Current additional_info:", formData.additional_info);
    
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      
      const newStepsStatus = [...stepsStatus];
      newStepsStatus[currentStep] = "upcoming";
      newStepsStatus[prevStep] = "current";
      setStepsStatus(newStepsStatus);
      setCurrentStep(prevStep);
    }
  }

  // Go to specific step (used in stepper)
  const goToStep = (step: number) => {
    console.log("Target step:", step);
    
    // If trying to go forward, validate all previous steps first
    if (step > currentStep) {
      for (let i = 0; i <= currentStep; i++) {
        if (!validateStep(i)) {
          return // Stop if current step is invalid
        }
      }
    }
    
    // Update step statuses
    const newStepsStatus = [...stepsStatus]
    
    // Mark all steps before the target as complete
    for (let i = 0; i < step; i++) {
      newStepsStatus[i] = "complete"
    }
    
    // Mark current step
    newStepsStatus[step] = "current"
    
    // Mark all steps after as upcoming
    for (let i = step + 1; i < steps.length; i++) {
      newStepsStatus[i] = "upcoming"
    }
    
    setStepsStatus(newStepsStatus)
    setCurrentStep(step)
  }

  // Validate all steps to ensure complete data
  const validateAllSteps = (): boolean => {
    console.log("=== VALIDATING ALL STEPS ===");
    console.log("Current form data:", JSON.stringify(formData, null, 2));
    
    const newErrors: FormErrors = {};
    
    // Validate step 0 (Basic Info)
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    // Validate step 1 (Details)
    if (!formData.base_price) newErrors.base_price = "Base price is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    
    // Validate step 2 (Images)
    if (!coverImage) newErrors.cover_url = "Cover image is required";
    
    // Set errors
    setErrors(newErrors);
    
    // If there are errors, navigate to the first step with errors
    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors found:", newErrors);
      
      if (newErrors.name || newErrors.category_id || newErrors.description) {
        if (currentStep !== 0) setCurrentStep(0); // Only change if not already there
        return false;
      } else if (newErrors.base_price || newErrors.quantity) {
        if (currentStep !== 1) setCurrentStep(1);
        return false;
      } else if (newErrors.cover_url) {
        if (currentStep !== 2) setCurrentStep(2);
        return false;
      }
    }
    
    console.log("All steps validation passed");
    return true;
  }

  // Handle form submission - now triggered directly by button click
  const handleSubmit = async (e: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Only allow submission on the final step
    if (currentStep !== steps.length - 1) {
      console.log("Not on final step, preventing submission");
      return;
    }
    
    // For the final step, validate all previous steps
    console.log("On final step, validating all steps");
    const allValid = validateAllSteps();
    if (!allValid) {
      console.log("Validation failed, stopping submission");
      return;
    }
    
    console.log("All validation passed, proceeding with submission");
    setIsSubmitting(true);

    try {
      // Create a deep copy of the form data to prevent reference issues
      const additionalInfoCopy = { ...formData.additional_info };
      
      // Prepare the data for submission
      const submitData: SubmitData = {
        ...formData,
        base_price: formData.base_price,
        quantity: parseInt(formData.quantity),
        tag: [...formData.tag], // Create a new array to prevent reference issues
        colors: [...formData.colors],
        sizes: [...formData.sizes],
        additional_info: additionalInfoCopy,
      };

      // Add file uploads only if they exist
      if (coverImage?.file) {
        submitData.cover_image_upload = coverImage.file;
      }
      
      // Only add non-existing images (new uploads)
      const newImageUploads = images
        .filter((img): img is { file: File; preview: string; uploading?: boolean; existing?: boolean } => 
          !img.existing && img.file !== undefined)
        .map(img => img.file);
      
      if (newImageUploads.length > 0) {
        submitData.images_upload = newImageUploads;
      }

      // Console log the data
      console.log("=== FINAL SUBMISSION DATA ===");
      console.log(JSON.stringify(submitData, null, 2));

      let result;
      
      if (isEditMode && productId) {
        // Update existing product
        result = await updateProduct(productId, submitData);
        toast.success("Product successfully updated!", {
          className: "bg-green-500 text-white",
        });
      } else {
        // Create new product
        result = await createProduct(submitData);
        toast.success("Product successfully added!", {
          className: "bg-green-500 text-white",
        });
      }

      // Redirect to products page after 2 seconds
      setTimeout(() => {
        router.push('/merchant/products');
      }, 2000);

    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save product. Please try again.", {
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProductBasicInfoTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayFieldChange={handleArrayFieldChange}
            errors={errors}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
          />
        )
      case 1:
        return (
          <ProductDetailsTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleAdditionalInfoChange={handleAdditionalInfoChange}
            handleSwitchChange={handleSwitchChange}
            errors={errors}
          />
        )
      case 2:
        return (
          <ProductImagesTab
            images={images}
            coverImage={coverImage}
            onAddImage={handleImageSelect}
            onRemoveImage={removeImage}
            onAddCoverImage={handleCoverImageSelect}
            onRemoveCoverImage={removeCoverImage}
            coverImageInputRef={coverImageInputRef}
            fileInputRef={fileInputRef}
            errors={errors}
          />
        )
      case 3:
        return (
          <ProductOptionsTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayFieldChange={handleArrayFieldChange}
            handleSwitchChange={handleSwitchChange}
          />
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading product data...</p>
        </div>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="container mx-auto py-8">
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            Your business is not verified yet. You need to verify your business before adding products.
            <div className="mt-2">
              <Link href="/merchant/profile/verify">
                <Button variant="outline" className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100">
                  Verify Your Business
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <Button variant="outline" onClick={() => window.history.back()} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-600">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {Object.keys(errors).length > 0 && (
        <Alert id="error-alert" variant="destructive" className="mb-6 animate-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="mt-2 list-disc pl-4">
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Steps indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center relative w-full">
              <Step 
                key={index}
                status={stepsStatus[index]}
                title={step.title}
                description={step.description}
                onClick={() => goToStep(index)}
              />
              {index < steps.length - 1 && (
                <div className={cn(
                  "h-[2px] grow mx-2",
                  stepsStatus[index] === "complete" ? "bg-green-600" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </CardHeader>
          
          {/* Steps content - NO FORM WRAPPER */}
          <CardContent>
            {renderStepContent()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              /* Navigation button for steps 0-2 */
              <Button 
                type="button" 
                onClick={goToNextStep}
              >
                Next
              </Button>
            ) : (
              /* Submit button only on final step */
              <Button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Product" : "Save Product")}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
