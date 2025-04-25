"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, File, FileText, Info, Loader2, Trash, Upload, X } from "lucide-react"
import { fileUploadService } from "@/lib/data"

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
  // Form state
  const [formData, setFormData] = useState({
    legalName: "",
    businessType: "",
    businessAddress: "",
    registrationNumber: "",
    registrationDate: "",
    tinNumber: "",
    vatNumber: "",
    taxOffice: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    branch: "",
    additionalInfo: "",
    ownerName: "", // Added owner/manager name field
  })

  // File upload state
  const [files, setFiles] = useState<Record<string, UploadedFile>>({
    businessRegistration: {
      name: "",
      size: 0,
      type: "",
      url: "",
      status: "uploaded",
      progress: 0,
    },
    taxCertificate: {
      name: "",
      size: 0,
      type: "",
      url: "",
      status: "uploaded",
      progress: 0,
    },
    bankStatement: {
      name: "",
      size: 0,
      type: "",
      url: "",
      status: "uploaded",
      progress: 0,
    },
    idDocument: {
      name: "",
      size: 0,
      type: "",
      url: "",
      status: "uploaded",
      progress: 0,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Refs for file inputs
  const fileInputRefs = {
    businessRegistration: useRef<HTMLInputElement>(null),
    taxCertificate: useRef<HTMLInputElement>(null),
    bankStatement: useRef<HTMLInputElement>(null),
    idDocument: useRef<HTMLInputElement>(null),
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Update file state as uploading
      setFiles((prev) => ({
        ...prev,
        [fieldName]: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: "",
          status: "uploading",
          progress: 0,
        },
      }))

      setUploadingField(fieldName)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles((prev) => {
          // Only update if still uploading
          if (prev[fieldName].status === "uploading" && prev[fieldName].progress < 90) {
            return {
              ...prev,
              [fieldName]: {
                ...prev[fieldName],
                progress: prev[fieldName].progress + 10,
              },
            }
          }
          return prev
        })
      }, 300)

      try {
        // Upload file (simulated)
        const result = (await fileUploadService.uploadFile(file)) as any

        clearInterval(progressInterval)

        // Update file state
        setFiles((prev) => ({
          ...prev,
          [fieldName]: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: result.url,
            status: "uploaded",
            progress: 100,
          },
        }))
      } catch (error) {
        clearInterval(progressInterval)

        // Update file state with error
        setFiles((prev) => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            status: "error",
            progress: 0,
          },
        }))
      } finally {
        setUploadingField(null)
      }
    }

    // Clear the input to allow selecting the same file again
    if (e.target.value) {
      e.target.value = ""
    }
  }

  // Trigger file input click
  const triggerFileInput = (fieldName: keyof typeof fileInputRefs) => {
    fileInputRefs[fieldName].current?.click()
  }

  // Remove a file
  const removeFile = (fieldName: string) => {
    setFiles((prev) => ({
      ...prev,
      [fieldName]: {
        name: "",
        size: 0,
        type: "",
        url: "",
        status: "uploaded",
        progress: 0,
      },
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const errors: string[] = []

    // Check required fields
    if (!formData.legalName) errors.push("Legal Business Name is required")
    if (!formData.businessType) errors.push("Business Type is required")
    if (!formData.businessAddress) errors.push("Business Address is required")
    if (!formData.registrationNumber) errors.push("Business Registration Number is required")
    if (!formData.tinNumber) errors.push("TIN Number is required")
    if (!formData.ownerName) errors.push("Business Owner/Manager Name is required") // Added validation

    // Check required files
    if (!files.businessRegistration.name) errors.push("Business Registration document is required")
    if (!files.taxCertificate.name) errors.push("Tax Certificate document is required")
    if (!files.idDocument.name) errors.push("ID document is required")

    // Check terms acceptance
    if (!termsAccepted) errors.push("You must accept the terms and conditions")

    setFormErrors(errors)

    if (errors.length > 0) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to profile page
      window.location.href = "/merchant/profile"
    }, 2000)
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
                <Label htmlFor="legalName">Legal Business Name*</Label>
                <Input
                  id="legalName"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleInputChange}
                  placeholder="Your official business name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="businessType">Business Type*</Label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
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
              <Label htmlFor="ownerName">Business Owner/Manager Name*</Label>
              <Input
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Full name of business owner or manager"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="businessAddress">Business Address*</Label>
              <Textarea
                id="businessAddress"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleInputChange}
                placeholder="Full address including sub-city, woreda, and city"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="registrationNumber">Business Registration Number*</Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="Official registration number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="registrationDate">Registration Date*</Label>
                <Input
                  id="registrationDate"
                  name="registrationDate"
                  value={formData.registrationDate}
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
                <Label htmlFor="tinNumber">Tax Identification Number (TIN)*</Label>
                <Input
                  id="tinNumber"
                  name="tinNumber"
                  value={formData.tinNumber}
                  onChange={handleInputChange}
                  placeholder="Ethiopian TIN number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vatNumber">VAT Registration Number (if applicable)</Label>
                <Input
                  id="vatNumber"
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleInputChange}
                  placeholder="VAT number"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="taxOffice">Tax Office</Label>
              <Input
                id="taxOffice"
                name="taxOffice"
                value={formData.taxOffice}
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
                <Label htmlFor="bankName">Bank Name*</Label>
                <select
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
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
                <Label htmlFor="accountNumber">Account Number*</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Business account number"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="accountName">Account Name*</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="Name on the account"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch*</Label>
                <Input
                  id="branch"
                  name="branch"
                  value={formData.branch}
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
            {/* Business Registration */}
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Business Registration Certificate</span>
                <span className="text-sm text-red-500 ml-auto">Required</span>
              </div>

              <input
                type="file"
                ref={fileInputRefs.businessRegistration}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e, "businessRegistration")}
              />

              {files.businessRegistration.name ? (
                <div className="rounded-md border p-3 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">{files.businessRegistration.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(files.businessRegistration.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>

                    {files.businessRegistration.status === "uploading" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Progress value={files.businessRegistration.progress} className="h-2" />
                        </div>
                        <span className="text-xs">{files.businessRegistration.progress}%</span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile("businessRegistration")}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-md border border-dashed p-6 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => triggerFileInput("businessRegistration")}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">Upload Document</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="mt-2 bg-blue-600 text-white hover:bg-blue-700 border-none"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Tax Certificate */}
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Tax Registration Certificate</span>
                <span className="text-sm text-red-500 ml-auto">Required</span>
              </div>

              <input
                type="file"
                ref={fileInputRefs.taxCertificate}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e, "taxCertificate")}
              />

              {files.taxCertificate.name ? (
                <div className="rounded-md border p-3 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">{files.taxCertificate.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(files.taxCertificate.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>

                    {files.taxCertificate.status === "uploading" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Progress value={files.taxCertificate.progress} className="h-2" />
                        </div>
                        <span className="text-xs">{files.taxCertificate.progress}%</span>
                      </div>
                    ) : (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("taxCertificate")}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-md border border-dashed p-6 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => triggerFileInput("taxCertificate")}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">Upload Document</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="mt-2 bg-blue-600 text-white hover:bg-blue-700 border-none"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Bank Statement */}
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Bank Statement or Void Check</span>
                <span className="text-sm text-red-500 ml-auto">Required</span>
              </div>

              <input
                type="file"
                ref={fileInputRefs.bankStatement}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e, "bankStatement")}
              />

              {files.bankStatement.name ? (
                <div className="rounded-md border p-3 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">{files.bankStatement.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(files.bankStatement.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>

                    {files.bankStatement.status === "uploading" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Progress value={files.bankStatement.progress} className="h-2" />
                        </div>
                        <span className="text-xs">{files.bankStatement.progress}%</span>
                      </div>
                    ) : (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("bankStatement")}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-md border border-dashed p-6 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => triggerFileInput("bankStatement")}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">Upload Document</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="mt-2 bg-blue-600 text-white hover:bg-blue-700 border-none"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ID Document */}
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium">ID of Business Owner/Representative</span>
                <span className="text-sm text-red-500 ml-auto">Required</span>
              </div>

              <input
                type="file"
                ref={fileInputRefs.idDocument}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e, "idDocument")}
              />

              {files.idDocument.name ? (
                <div className="rounded-md border p-3 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">{files.idDocument.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(files.idDocument.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>

                    {files.idDocument.status === "uploading" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Progress value={files.idDocument.progress} className="h-2" />
                        </div>
                        <span className="text-xs">{files.idDocument.progress}%</span>
                      </div>
                    ) : (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("idDocument")}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-md border border-dashed p-6 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => triggerFileInput("idDocument")}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">Upload Document</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="mt-2 bg-blue-600 text-white hover:bg-blue-700 border-none"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              )}
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
              <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional information you'd like to provide"
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
                required
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the terms and conditions
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button variant="outline" asChild>
              <Link href="/merchant/profile">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting || uploadingField !== null}
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
