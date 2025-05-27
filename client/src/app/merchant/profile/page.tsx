"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Building, Calendar, Check, Edit, Globe, Mail, Phone, ShieldCheck, Upload, X } from "lucide-react"
import { useTenantStore } from "@/store/tenantStore"
import { toast } from "sonner"

export default function BusinessProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const { tenantData, fetchTenantData, updateTenantData, isLoading } = useTenantStore()
  const [formData, setFormData] = useState<FormData>(new FormData())
  const [selectedFiles, setSelectedFiles] = useState<{
    business_registration_certificate?: File
    business_license?: File
    tax_registration_certificate?: File
    id_card?: File
  }>({})

  const businessRegRef = useRef<HTMLInputElement>(null)
  const businessLicenseRef = useRef<HTMLInputElement>(null)
  const taxRegRef = useRef<HTMLInputElement>(null)
  const idCardRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTenantData()
  }, [fetchTenantData])

  const isVerified = tenantData?.is_verified || false
  const isUnderReview = tenantData?.tenant_verification_status === "under_review"
  const isApproved = tenantData?.tenant_verification_status === "approved"

  const canEditProfile = !isUnderReview
  const canEditVerificationFields = !isUnderReview
  const canEditDocuments = !isApproved && !isUnderReview

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!canEditDocuments) return
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [field]: file }))
      formData.set(field, file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!canEditVerificationFields) return
    const { name, value } = e.target
    formData.set(name, value)
  }

  const handleSave = async () => {
    try {
      // Add all text fields to formData
      const textFields = {
        legal_name: formData.get("legal_name") || tenantData?.legal_name,
        business_type: formData.get("business_type") || tenantData?.business_type,
        business_bio: formData.get("business_bio") || tenantData?.business_bio,
        email: formData.get("email") || tenantData?.email,
        phone: formData.get("phone") || tenantData?.phone,
        address: formData.get("address") || tenantData?.address,
        website_url: formData.get("website_url") || tenantData?.website_url,
        tin_number: formData.get("tin_number") || tenantData?.tin_number,
        business_registration_number:
          formData.get("business_registration_number") || tenantData?.business_registration_number,
        bank_account_number: formData.get("bank_account_number") || tenantData?.bank_account_number,
        bank_name: formData.get("bank_name") || tenantData?.bank_name,
        bank_account_name: formData.get("bank_account_name") || tenantData?.bank_account_name,
        bank_branch: formData.get("bank_branch") || tenantData?.bank_branch,
        tax_office_address: formData.get("tax_office_address") || tenantData?.tax_office_address,
        vat_number: formData.get("vat_number") || tenantData?.vat_number,
        tenant_verification_status: "pending",
      }

      // Add all text fields to formData
      Object.entries(textFields).forEach(([key, value]) => {
        if (value) formData.set(key, value.toString())
      })

      await updateTenantData(formData)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedFiles({})
    setFormData(new FormData())
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[180px]" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )

  const VerificationSkeleton = () => (
    <div className="space-y-6">
      {/* Document Upload Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2">
          {/* Business Registration Certificate */}
          <div className="rounded-md border border-dashed p-4">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-5 w-[180px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-9 w-[100px]" />
            </div>
          </div>
          {/* Tax Registration Certificate */}
          <div className="rounded-md border border-dashed p-4">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-5 w-[180px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-9 w-[100px]" />
            </div>
          </div>
          {/* ID Card */}
          <div className="rounded-md border border-dashed p-4">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-5 w-[180px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-9 w-[100px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="space-y-4">
        {/* TIN Number */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-[250px]" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-[300px]" />
        </div>

        {/* Business License */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-[250px]" />
        </div>

        {/* Bank Account */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-[180px]" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-[280px]" />
        </div>

        {/* Bank Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-[130px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-[140px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Tax Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-[160px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Business Profile</h2>
          <p className="text-muted-foreground">Manage your business information and verification status</p>
        </div>
        {!isLoading && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} className="gap-2" disabled={isLoading}>
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
                <Button onClick={handleSave} className="gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={() => setIsEditing(true)}
                className="gap-2"
                disabled={isLoading || !canEditProfile}
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {!isLoading && isUnderReview && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Under Review</AlertTitle>
          <AlertDescription>
            Your business verification is currently under review. You cannot make any changes until the review is
            complete.
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !isVerified && !isUnderReview && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            Your business is not verified yet. Verified merchants can list their own products and access additional
            features.
            <div className="mt-2">
              <Link href="/merchant/profile/verify">
                <Button variant="outline" className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100">
                  Verify Your Business
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-6">
          {/* Alert skeleton */}
          <div className="rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 mt-0.5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="space-y-4">
            <div className="flex space-x-1 rounded-lg bg-muted p-1">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>

            {/* Tab content skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Business Details Card */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Card */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Business Information</TabsTrigger>
            <TabsTrigger value="verification" disabled={isVerified}>
              Verification
            </TabsTrigger>
            <TabsTrigger value="documents" disabled={!isVerified}>
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                  <CardDescription>Your business information as it appears to customers and partners</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEditing && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Verification Status:</span>
                        {tenantData?.tenant_verification_status ? (
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${tenantData.tenant_verification_status === "approved" ? "bg-green-100 text-green-800" : "bg-gray-700 text-gray-200"}`}
                          >
                            {tenantData.tenant_verification_status.charAt(0).toUpperCase() +
                              tenantData.tenant_verification_status.slice(1)}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-700 text-gray-200">
                            ----
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Founded:</span>
                        <span>
                          {tenantData?.licence_registration_date
                            ? new Date(tenantData.licence_registration_date).getFullYear()
                            : "----"}
                        </span>
                      </div>
                    </>
                  )}
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="legal_name">Company Name</Label>
                        <Input
                          id="legal_name"
                          name="legal_name"
                          defaultValue={tenantData?.legal_name || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="business_type">Business Type</Label>
                        <Input
                          id="business_type"
                          name="business_type"
                          defaultValue={tenantData?.business_type || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="business_bio">Business Description</Label>
                        <Textarea
                          id="business_bio"
                          name="business_bio"
                          defaultValue={tenantData?.business_bio || ""}
                          rows={4}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Company Name:</span>
                        <span>{tenantData?.legal_name || "----"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Business Type:</span>
                        <span>{tenantData?.business_type || "----"}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Description:</div>
                        <p className="text-sm text-muted-foreground">{tenantData?.business_bio || "----"}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>How customers and partners can reach your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : isEditing ? (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          defaultValue={tenantData?.email || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Contact Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          defaultValue={tenantData?.phone || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Business Address</Label>
                        <Textarea
                          id="address"
                          name="address"
                          defaultValue={tenantData?.address || ""}
                          rows={2}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="website_url">Website</Label>
                        <Input
                          id="website_url"
                          name="website_url"
                          defaultValue={tenantData?.website_url || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span>{tenantData?.email || "----"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span>{tenantData?.phone || "----"}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Address:</div>
                        <p className="text-sm text-muted-foreground">{tenantData?.address || "----"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Website:</span>
                        {tenantData?.website_url ? (
                          <Link
                            href={tenantData.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {tenantData.website_url}
                          </Link>
                        ) : (
                          <span>----</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {isVerified && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Verification Information</CardTitle>
                    <CardDescription>Your verified business credentials</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="font-medium">TIN Number:</span>
                        <span>{tenantData?.tin_number || "----"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Business License:</span>
                        <span>{tenantData?.business_registration_number || "----"}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Bank Account:</span>
                        <span>{tenantData?.bank_account_number || "----"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Verified Since:</span>
                        <span>{tenantData?.tenant_verification_date || "----"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Business Verification</CardTitle>
                <CardDescription>
                  {isUnderReview
                    ? "Your verification is under review. You cannot make any changes at this time."
                    : isApproved
                      ? "Your business is verified. You can update your information but cannot modify documents."
                      : "Verify your business to access additional features and build trust with customers"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <VerificationSkeleton />
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tin_number">Tax Identification Number (TIN)</Label>
                      <Input
                        id="tin_number"
                        name="tin_number"
                        placeholder="XX-XXXXXXX"
                        defaultValue={tenantData?.tin_number || ""}
                        onChange={handleInputChange}
                        disabled={!canEditVerificationFields}
                      />
                      <p className="text-xs text-muted-foreground">Enter your Ethiopian Tax Identification Number</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="business_registration_number">Business License Number</Label>
                      <Input
                        id="business_registration_number"
                        name="business_registration_number"
                        placeholder="BL-XXXXXXXXX"
                        defaultValue={tenantData?.business_registration_number || ""}
                        onChange={handleInputChange}
                        disabled={!canEditVerificationFields}
                      />
                      <p className="text-xs text-muted-foreground">Enter your business license number</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bank_account_number">Bank Account Information</Label>
                      <Input
                        id="bank_account_number"
                        name="bank_account_number"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        defaultValue={tenantData?.bank_account_number || ""}
                        onChange={handleInputChange}
                        disabled={!canEditVerificationFields}
                      />
                      <p className="text-xs text-muted-foreground">Enter your business bank account number</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bank_name">Bank Name</Label>
                      <Input
                        id="bank_name"
                        name="bank_name"
                        defaultValue={tenantData?.bank_name || ""}
                        onChange={handleInputChange}
                        disabled={!canEditVerificationFields}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bank_account_name">Bank Account Name</Label>
                      <Input
                        id="bank_account_name"
                        name="bank_account_name"
                        defaultValue={tenantData?.bank_account_name || ""}
                        onChange={handleInputChange}
                        disabled={!canEditVerificationFields}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bank_branch">Bank Branch</Label>
                      <Input
                        id="bank_branch"
                        name="bank_branch"
                        defaultValue={tenantData?.bank_branch || ""}
                        onChange={handleInputChange}
                        disabled={!canEditVerificationFields}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="tax_office_address">Tax Office Address</Label>
                      <Input
                        id="tax_office_address"
                        name="tax_office_address"
                        defaultValue={tenantData?.tax_office_address || ""}
                        onChange={handleInputChange}
                        disabled={!canEditVerificationFields}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="vat_number">VAT Number</Label>
                      <Input
                        id="vat_number"
                        name="vat_number"
                        defaultValue={tenantData?.vat_number || ""}
                        onChange={handleInputChange}
                        disabled={!canEditVerificationFields}
                      />
                    </div>

                    {!isApproved && (
                      <div className="grid gap-2">
                        <Label>Upload Documents</Label>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-md border border-dashed p-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              {selectedFiles.business_registration_certificate ? (
                                <div className="relative w-full h-32">
                                  <Image
                                    src={
                                      URL.createObjectURL(selectedFiles.business_registration_certificate) ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt="Business Registration"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              ) : tenantData?.business_registration_certificate_url ? (
                                <div className="relative w-full h-32">
                                  <Image
                                    src={tenantData.business_registration_certificate_url || "/placeholder.svg"}
                                    alt="Business Registration"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              ) : (
                                <Upload className="h-8 w-8 text-muted-foreground" />
                              )}
                              <p className="font-medium">Business Registration</p>
                              <p className="text-xs text-muted-foreground">
                                Upload your business registration certificate
                              </p>
                              <input
                                type="file"
                                ref={businessRegRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "business_registration_certificate")}
                                disabled={!canEditDocuments}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => businessRegRef.current?.click()}
                                disabled={!canEditDocuments}
                              >
                                Select File
                              </Button>
                            </div>
                          </div>
                          <div className="rounded-md border border-dashed p-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              {selectedFiles.tax_registration_certificate ? (
                                <div className="relative w-full h-32">
                                  <Image
                                    src={
                                      URL.createObjectURL(selectedFiles.tax_registration_certificate) ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt="Tax Certificate"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              ) : tenantData?.tax_registration_certificate_url ? (
                                <div className="relative w-full h-32">
                                  <Image
                                    src={tenantData.tax_registration_certificate_url || "/placeholder.svg"}
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
                                onChange={(e) => handleFileChange(e, "tax_registration_certificate")}
                                disabled={!canEditDocuments}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => taxRegRef.current?.click()}
                                disabled={!canEditDocuments}
                              >
                                Select File
                              </Button>
                            </div>
                          </div>
                          <div className="rounded-md border border-dashed p-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              {selectedFiles.id_card ? (
                                <div className="relative w-full h-32">
                                  <Image
                                    src={URL.createObjectURL(selectedFiles.id_card) || "/placeholder.svg"}
                                    alt="ID Card"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              ) : tenantData?.id_card_url ? (
                                <div className="relative w-full h-32">
                                  <Image
                                    src={tenantData.id_card_url || "/placeholder.svg"}
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
                                onChange={(e) => handleFileChange(e, "id_card")}
                                disabled={!canEditDocuments}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => idCardRef.current?.click()}
                                disabled={!canEditDocuments}
                              >
                                Select File
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={isLoading || !canEditVerificationFields}>
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : isApproved ? (
                    "Update Information"
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Verified Documents</CardTitle>
                <CardDescription>Your business verification documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {tenantData?.business_registration_certificate_url && (
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Business Registration</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </div>
                      <div className="relative w-full h-48 mt-2">
                        <Image
                          src={tenantData.business_registration_certificate_url || "/placeholder.svg"}
                          alt="Business Registration"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Document ID: {tenantData?.business_registration_number || "----"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Verified on: {tenantData?.tenant_verification_date || "----"}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Document
                      </Button>
                    </div>
                  )}
                  {tenantData?.tax_registration_certificate_url && (
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Tax Certificate</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </div>
                      <div className="relative w-full h-48 mt-2">
                        <Image
                          src={tenantData.tax_registration_certificate_url || "/placeholder.svg"}
                          alt="Tax Certificate"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Document ID: {tenantData?.tin_number || "----"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Verified on: {tenantData?.tenant_verification_date || "----"}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Document
                      </Button>
                    </div>
                  )}
                  {tenantData?.id_card_url && (
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-600" />
                          <span className="font-medium">ID Card</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </div>
                      <div className="relative w-full h-48 mt-2">
                        <Image
                          src={tenantData.id_card_url || "/placeholder.svg"}
                          alt="ID Card"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Verified on: {tenantData?.tenant_verification_date || "----"}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Document
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
