"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Step, StepStatus } from "@/components/ui/step"
import { ArrowLeft, type File, CheckCircle, Circle, XCircle } from "lucide-react"
import { ProductBasicInfoTab } from "@/components/products/product-basic-info-tab"
import { ProductDetailsTab } from "@/components/products/product-details-tab"
import { ProductImagesTab } from "@/components/products/product-images-tab"
import { ProductOptionsTab } from "@/components/products/product-options-tab"
import { FormSuccessAlert } from "@/components/products/form-success-alert"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import useProductStore from "@/store/useProductStore"
import useCategoryStore from "@/store/useCategoryStore"
import { toast } from "sonner"

interface FormErrors {
  name?: string
  sku?: string
  category_id?: string
  description?: string
  base_price?: string
  quantity?: string
  cover_url?: string
}

export default function AddProductPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [stepsStatus, setStepsStatus] = useState<StepStatus[]>([
    "current", // Basic Info
    "upcoming", // Details
    "upcoming", // Images
    "upcoming"  // Options
  ])
  const [coverImage, setCoverImage] = useState<{ file: File; preview: string; uploading?: boolean } | null>(null)
  const [images, setImages] = useState<Array<{ file: File; preview: string; uploading?: boolean }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null!)
  const coverImageInputRef = useRef<HTMLInputElement>(null!)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
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

  const router = useRouter()
  const createProduct = useProductStore((state: any) => state.createProduct)
  const { categories, fetchCategories, isLoading: isCategoriesLoading } = useCategoryStore()
  
  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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
        // console.log(`Removing key "${key}" from additional_info`);
        delete newAdditionalInfo[key];
      } else {
        // Otherwise, update or add the key-value pair
        // console.log(`Setting additional_info["${key}"] = "${value}"`);
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
      URL.revokeObjectURL(coverImage.preview)
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
      URL.revokeObjectURL(updatedImages[index].preview)
      updatedImages.splice(index, 1)
      return updatedImages
    })
  }

  // Validate current step
  const validateStep = (step: number): boolean => {
    // console.log(`Validating step ${step}`);
    // console.log(`Current additional_info:`, JSON.stringify(formData.additional_info, null, 2));
    
    const newErrors: FormErrors = {};
    
    // Validation logic for each step
    if (step === 0) { // Basic Info
      if (!formData.name.trim()) newErrors.name = "Product name is required";
      if (!formData.sku.trim()) newErrors.sku = "SKU is required";
      if (!formData.category_id) newErrors.category_id = "Category is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
    } 
    else if (step === 1) { // Details
      if (!formData.base_price) newErrors.base_price = "Base price is required";
      if (!formData.quantity) newErrors.quantity = "Quantity is required";
      
      // Log additional_info specifically for the Details step
      // console.log("Validating Details step with additional_info:", JSON.stringify(formData.additional_info, null, 2));
    }
    else if (step === 2) { // Images
      if (!coverImage) newErrors.cover_url = "Cover image is required";
      // Note: Additional images are optional, so we don't validate them
    }
    // Step 3 (Options) has no required fields
    
    // Set errors
    setErrors(newErrors);
    
    // Log validation result
    const isValid = Object.keys(newErrors).length === 0;
    // console.log(`Step ${step} validation result:`, isValid ? "Valid" : "Invalid");
    
    return isValid;
  }

  // Move to next step with validation
  const goToNextStep = () => {
    // console.log("goToNextStep called. Current step:", currentStep);
    console.log("Current form data:", formData);
    // console.log("Current additional_info:", formData.additional_info);
    
    // First validate current step
    if (validateStep(currentStep)) {
      // console.log("Current step validated successfully");
      
      // Update current step status to completed
      const newStepsStatus = [...stepsStatus];
      newStepsStatus[currentStep] = "complete";
      
      // Set next step as current
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        // console.log("Moving to next step:", nextStep);
        // console.log("Form data being carried to next step:", formData);
        // console.log("Additional info being carried to next step:", formData.additional_info);
        
        newStepsStatus[nextStep] = "current";
        setStepsStatus(newStepsStatus);
        setCurrentStep(nextStep);
        // Clear any errors
        setErrors({});
      } else {
        console.log("Already at last step");
      }
    } else {
      console.log("Validation failed for current step");
    }
  }

  // Go to previous step
  const goToPreviousStep = () => {
    console.log("goToPreviousStep called. Current step:", currentStep);
    console.log("Current form data:", formData);
    console.log("Current additional_info:", formData.additional_info);
    
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      console.log("Moving to previous step:", prevStep);
      
      const newStepsStatus = [...stepsStatus];
      newStepsStatus[currentStep] = "upcoming";
      newStepsStatus[prevStep] = "current";
      setStepsStatus(newStepsStatus);
      setCurrentStep(prevStep);
      
      // console.log("Form data being carried to previous step:", formData);
      // console.log("Additional info being carried to previous step:", formData.additional_info);
    }
  }

  // Go to specific step (used in stepper)
  const goToStep = (step: number) => {
    console.log("goToStep called. Target step:", step);
    
    // If trying to go forward, validate all previous steps first
    if (step > currentStep) {
      console.log("Trying to go forward, validating current step");
      for (let i = 0; i <= currentStep; i++) {
        if (!validateStep(i)) {
          console.log("Step", i, "validation failed, stopping navigation");
          return // Stop if current step is invalid
        }
      }
    }
    
    console.log("Validation passed or going backwards, proceeding with navigation");
    
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
    console.log("Current additional_info:", JSON.stringify(formData.additional_info, null, 2));
    
    const newErrors: FormErrors = {};
    
    // Validate step 0 (Basic Info)
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
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
      
      if (newErrors.name || newErrors.sku || newErrors.category_id || newErrors.description) {
        if (currentStep !== 0) setCurrentStep(0); // Only change if not already there
        console.log("Navigating to step 0 (Basic Info) due to validation errors");
        return false;
      } else if (newErrors.base_price || newErrors.quantity) {
        if (currentStep !== 1) setCurrentStep(1);
        console.log("Navigating to step 1 (Details) due to validation errors");
        return false;
      } else if (newErrors.cover_url) {
        if (currentStep !== 2) setCurrentStep(2);
        console.log("Navigating to step 2 (Images) due to validation errors");
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
      const submitData = {
        ...formData,
        // cover_url: coverImage?.preview || "",
        // images: images.map(img => img.preview),
        cover_url: "https://example.com/image.jpg",
        images: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        base_price: formData.base_price,
        quantity: parseInt(formData.quantity),
        tag: [...formData.tag], // Create a new array to prevent reference issues
        colors: [...formData.colors],
        sizes: [...formData.sizes],
        additional_info: additionalInfoCopy
      };

      // Console log the data
      console.log("=== FINAL SUBMISSION DATA ===");
      console.log(JSON.stringify(submitData, null, 2));

      // Create the product using the store
      const newProduct = await createProduct(submitData);

      // Show success message
      toast.success("Product successfully added!", {
        className: "bg-green-500 text-white",
      });

      // Clear form after successful submission
      setFormData({
        name: "",
        sku: "",
        base_price: "",
        quantity: "",
        category_id: "",
        description: "",
        short_description: "",
        tag: [],
        brand: "",
        additional_info: {},
        warranty: "",
        is_public: true,
        colors: [],
        sizes: [],
      });
      setCoverImage(null);
      setImages([]);
      setCurrentStep(0);
      setStepsStatus(["current", "upcoming", "upcoming", "upcoming"]);

      // Redirect to products page after 2 seconds
      setTimeout(() => {
        router.push('/merchant/products');
      }, 2000);

    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error instanceof Error ? error.message : "Failed to add product. Please try again.", {
        className: "bg-red-500 text-white",
      });
      setErrors({
        name: "Failed to add product. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Generate a random SKU
  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const sku = `SKU-${timestamp}-${random}`
    setFormData(prev => ({
      ...prev,
      sku
    }))
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
            generateSKU={generateSKU}
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Add New Product</h1>
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
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
