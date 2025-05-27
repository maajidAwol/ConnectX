"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, File, FileText, Info, Loader2, Trash, Upload, X } from "lucide-react"
import { useTenantStore } from "@/store/tenantStore"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"

// File type for document uploads
type UploadedFile = {
  name: string
  size: number
  type: string
  url: string
  status: "uploaded" | "error" | "uploading"
  progress: number
}

export default function VerifyBusiness() {
  const { tenantData, fetchTenantData, updateTenantData, isLoading } = useTenantStore()

  // Form state
  const [formData, setFormData] = useState({
    legal_name: "",
    business_type: "",
    address: "",
    business_registration_number: "",
    licence_registration_date: "",
    tin_number: "",
    vat_number: "",
    tax_office_address: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
    bank_branch: "",
    business_bio: "",
    tenant_verification_status: "pending" as const,
  })

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<{
    business_registration_certificate?: File
    tax_registration_certificate?: File
    id_card?: File
  }>({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Refs for file inputs
  const businessRegRef = useRef<HTMLInputElement>(null)
  const taxRegRef = useRef<HTMLInputElement>(null)
  const idCardRef = useRef<HTMLInputElement>(null)

  // Load tenant data on component mount
  useEffect(() => {
    fetchTenantData()
  }, [fetchTenantData])

  // Update form data when tenant data is loaded
  useEffect(() => {
    if (tenantData) {
      setFormData(prev => ({
        ...prev,
        legal_name: tenantData.legal_name || "",
        business_type: tenantData.business_type || "",
        address: tenantData.address || "",
        business_registration_number: tenantData.business_registration_number || "",
        licence_registration_date: tenantData.licence_registration_date || "",
        tin_number: tenantData.tin_number || "",
        vat_number: tenantData.vat_number || "",
        tax_office_address: tenantData.tax_office_address || "",
        bank_name: tenantData.bank_name || "",
        bank_account_number: tenantData.bank_account_number || "",
        bank_account_name: tenantData.bank_account_name || "",
        bank_branch: tenantData.bank_branch || "",
        business_bio: tenantData.business_bio || "",
      }))
    }
  }, [tenantData])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [field]: file }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const errors: string[] = []

    // Check required fields
    if (!formData.legal_name) errors.push("Legal Business Name is required")
    if (!formData.business_type) errors.push("Business Type is required")
    if (!formData.address) errors.push("Business Address is required")
    if (!formData.business_registration_number) errors.push("Business Registration Number is required")
    if (!formData.tin_number) errors.push("TIN Number is required")

    // Check required files
    if (!selectedFiles.business_registration_certificate && !tenantData?.business_registration_certificate_url) {
      errors.push("Business Registration document is required")
    }
    if (!selectedFiles.tax_registration_certificate && !tenantData?.tax_registration_certificate_url) {
      errors.push("Tax Certificate document is required")
    }
    if (!selectedFiles.id_card && !tenantData?.id_card_url) {
      errors.push("ID document is required")
    }

    // Check terms acceptance
    if (!termsAccepted) errors.push("You must accept the terms and conditions")

    setFormErrors(errors)

    if (errors.length > 0) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData object
      const submitData = new FormData()

      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value)
      })

      // Ensure verification status is set to pending
      submitData.set('tenant_verification_status', 'pending')

      // Debug: Log what's being submitted
      console.log('Form data being submitted:')
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}:`, value)
      }

      // Add files
      if (selectedFiles.business_registration_certificate) {
        submitData.append('business_registration_certificate', selectedFiles.business_registration_certificate)
      }
      if (selectedFiles.tax_registration_certificate) {
        submitData.append('tax_registration_certificate', selectedFiles.tax_registration_certificate)
      }
      if (selectedFiles.id_card) {
        submitData.append('id_card', selectedFiles.id_card)
      }

      // Update tenant data
      await updateTenantData(submitData)
      
      toast.success("Verification request submitted successfully")
      // Redirect to profile page
      window.location.href = "/merchant/profile"
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit verification request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/merchant/profile" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Business Verification</h2>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Verification Process</AlertTitle>
        <AlertDescription>
          Complete this form to verify your business. Our team will review your information within 2-3 business days.
          Verified merchants can list their own products and access additional features.
        </AlertDescription>
      </Alert>

      {formErrors.length > 0 && (
        <Alert className="bg-red-50 text-red-800 border-red-200">
          <X className="h-4 w-4" />
          <AlertTitle>Please fix the following errors:</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Provide your official business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="legal_name">Legal Business Name*</Label>
                <Input
                  id="legal_name"
                  name="legal_name"
                  value={formData.legal_name}
                  onChange={handleInputChange}
                  placeholder="Your official business name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business_type">Business Type*</Label>
                <select
                  id="business_type"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                >
                  <option value="">Select business type</option>
                  <option value="sole-proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="private-limited">Private Limited Company</option>
                  <option value="share-company">Share Company</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Business Address*</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Full address including sub-city, woreda, and city"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="business_registration_number">Business Registration Number*</Label>
                <Input
                  id="business_registration_number"
                  name="business_registration_number"
                  value={formData.business_registration_number}
                  onChange={handleInputChange}
                  placeholder="Official registration number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="licence_registration_date">Registration Date*</Label>
                <Input
                  id="licence_registration_date"
                  name="licence_registration_date"
                  value={formData.licence_registration_date}
                  onChange={handleInputChange}
                  type="date"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Information</CardTitle>
            <CardDescription>Provide your tax identification details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="tin_number">Tax Identification Number (TIN)*</Label>
                <Input
                  id="tin_number"
                  name="tin_number"
                  value={formData.tin_number}
                  onChange={handleInputChange}
                  placeholder="Ethiopian TIN number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vat_number">VAT Registration Number (if applicable)</Label>
                <Input
                  id="vat_number"
                  name="vat_number"
                  value={formData.vat_number}
                  onChange={handleInputChange}
                  placeholder="VAT number"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tax_office_address">Tax Office</Label>
              <Input
                id="tax_office_address"
                name="tax_office_address"
                value={formData.tax_office_address}
                onChange={handleInputChange}
                placeholder="Name of tax office where registered"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banking Information</CardTitle>
            <CardDescription>Provide your business banking details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="bank_name">Bank Name*</Label>
                <select
                  id="bank_name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                >
                  <option value="">Select bank</option>
                  <option value="cbe">Commercial Bank of Ethiopia</option>
                  <option value="dashen">Dashen Bank</option>
                  <option value="awash">Awash Bank</option>
                  <option value="abyssinia">Bank of Abyssinia</option>
                  <option value="coop">Cooperative Bank of Oromia</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_account_number">Account Number*</Label>
                <Input
                  id="bank_account_number"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleInputChange}
                  placeholder="Business account number"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="bank_account_name">Account Name*</Label>
                <Input
                  id="bank_account_name"
                  name="bank_account_name"
                  value={formData.bank_account_name}
                  onChange={handleInputChange}
                  placeholder="Name on the account"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_branch">Branch*</Label>
                <Input
                  id="bank_branch"
                  name="bank_branch"
                  value={formData.bank_branch}
                  onChange={handleInputChange}
                  placeholder="Bank branch"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>Upload the required verification documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Business Registration Certificate */}
              <div className="rounded-md border border-dashed p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  {selectedFiles.business_registration_certificate ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={URL.createObjectURL(selectedFiles.business_registration_certificate)}
                        alt="Business Registration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : tenantData?.business_registration_certificate_url ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={tenantData.business_registration_certificate_url}
                        alt="Business Registration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                  <p className="font-medium">Business Registration</p>
                  <p className="text-xs text-muted-foreground">Upload your business registration certificate</p>
                  <input
                    type="file"
                    ref={businessRegRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'business_registration_certificate')}
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => businessRegRef.current?.click()}
                  >
                    Select File
                  </Button>
                </div>
              </div>

              {/* Tax Registration Certificate */}
              <div className="rounded-md border border-dashed p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  {selectedFiles.tax_registration_certificate ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={URL.createObjectURL(selectedFiles.tax_registration_certificate)}
                        alt="Tax Certificate"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : tenantData?.tax_registration_certificate_url ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={tenantData.tax_registration_certificate_url}
                        alt="Tax Certificate"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                  <p className="font-medium">Tax Certificate</p>
                  <p className="text-xs text-muted-foreground">Upload your tax registration certificate</p>
                  <input
                    type="file"
                    ref={taxRegRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'tax_registration_certificate')}
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => taxRegRef.current?.click()}
                  >
                    Select File
                  </Button>
                </div>
              </div>

              {/* ID Card */}
              <div className="rounded-md border border-dashed p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  {selectedFiles.id_card ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={URL.createObjectURL(selectedFiles.id_card)}
                        alt="ID Card"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : tenantData?.id_card_url ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={tenantData.id_card_url}
                        alt="ID Card"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                  <p className="font-medium">ID Card</p>
                  <p className="text-xs text-muted-foreground">Upload your ID card</p>
                  <input
                    type="file"
                    ref={idCardRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'id_card')}
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => idCardRef.current?.click()}
                  >
                    Select File
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Provide any additional details that may help with verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="business_bio">Business Bio (Optional)</Label>
              <Textarea
                id="business_bio"
                name="business_bio"
                value={formData.business_bio}
                onChange={handleInputChange}
                placeholder="A brief description of your business"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
            <CardDescription>Review and accept our terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-4 text-sm">
              <p className="mb-2 font-medium">By submitting this verification request, you confirm that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All information provided is accurate and complete.</li>
                <li>You are authorized to represent this business.</li>
                <li>You agree to ConnectX's Terms of Service and Merchant Agreement.</li>
                <li>You understand that false information may result in account termination.</li>
              </ul>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-gray-300"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the terms and conditions *
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" asChild>
              <Link href="/merchant/profile">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Verification Request"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
