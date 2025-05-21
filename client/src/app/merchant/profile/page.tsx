"use client"

import { useEffect, useState } from "react"
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
import { AlertCircle, Building, Calendar, Check, Edit, Globe, Mail, Phone, ShieldCheck, Upload } from "lucide-react"
import { useTenantStore } from "@/store/tenantStore"

export default function BusinessProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const { tenantData, fetchTenantData, isLoading } = useTenantStore()

  useEffect(() => {
    fetchTenantData()
  }, [fetchTenantData])

  const isVerified = tenantData?.is_verified || false

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Business Profile</h2>
          <p className="text-muted-foreground">Manage your business information and verification status</p>
        </div>
        <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)} className="gap-2">
          {isEditing ? (
            <>
              <Check className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </>
          )}
        </Button>
      </div>

      {!isVerified && (
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Verification Status:</span>
                  </div>
                  <Badge
                    variant={isVerified ? "default" : "outline"}
                    className={isVerified ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {tenantData?.tenant_verification_status || "----"}
                  </Badge>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue={tenantData?.legal_name || ""} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="business-type">Business Type</Label>
                      <Input id="business-type" defaultValue={tenantData?.business_type || ""} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="founded-year">Founded Year</Label>
                      <Input id="founded-year" type="date" defaultValue={tenantData?.licence_registration_date || ""} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea id="description" defaultValue={tenantData?.business_bio || ""} rows={4} />
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
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Founded:</span>
                      <span>{tenantData?.licence_registration_date || "----"}</span>
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
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input id="contact-email" type="email" defaultValue={tenantData?.email || ""} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input id="contact-phone" defaultValue={tenantData?.phone || ""} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Textarea id="address" defaultValue={tenantData?.address || ""} rows={2} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue={tenantData?.website_url || ""} />
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
                Verify your business to access additional features and build trust with customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                  Verified merchants can list their own products, access premium features, and build trust with
                  customers.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="tin-number">Tax Identification Number (TIN)</Label>
                  <Input id="tin-number" placeholder="XX-XXXXXXX" defaultValue={tenantData?.tin_number || ""} />
                  <p className="text-xs text-muted-foreground">Enter your Ethiopian Tax Identification Number</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="business-license">Business License Number</Label>
                  <Input id="business-license" placeholder="BL-XXXXXXXXX" defaultValue={tenantData?.business_registration_number || ""} />
                  <p className="text-xs text-muted-foreground">Enter your business license number</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bank-account">Bank Account Information</Label>
                  <Input id="bank-account" placeholder="XXXX-XXXX-XXXX-XXXX" defaultValue={tenantData?.bank_account_number || ""} />
                  <p className="text-xs text-muted-foreground">Enter your business bank account number</p>
                </div>

                <div className="grid gap-2">
                  <Label>Upload Documents</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border border-dashed p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {tenantData?.business_registration_certificate_url ? (
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
                        <Button variant="outline" size="sm">
                          Select File
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-md border border-dashed p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {tenantData?.tax_registration_certificate_url ? (
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
                        <Button variant="outline" size="sm">
                          Select File
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Submit for Verification</Button>
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
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Business Registration</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  {tenantData?.business_registration_certificate_url && (
                    <div className="relative w-full h-48 mt-2">
                      <Image
                        src={tenantData.business_registration_certificate_url}
                        alt="Business Registration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">Document ID: {tenantData?.business_registration_number || "----"}</p>
                  <p className="text-sm text-muted-foreground">Verified on: {tenantData?.tenant_verification_date || "----"}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Document
                  </Button>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Tax Certificate</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  {tenantData?.tax_registration_certificate_url && (
                    <div className="relative w-full h-48 mt-2">
                      <Image
                        src={tenantData.tax_registration_certificate_url}
                        alt="Tax Certificate"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">Document ID: {tenantData?.tin_number || "----"}</p>
                  <p className="text-sm text-muted-foreground">Verified on: {tenantData?.tenant_verification_date || "----"}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Document
                  </Button>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Bank Account Verification</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  {tenantData?.bank_statement_url && (
                    <div className="relative w-full h-48 mt-2">
                      <Image
                        src={tenantData.bank_statement_url}
                        alt="Bank Statement"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">Document ID: {tenantData?.bank_account_number || "----"}</p>
                  <p className="text-sm text-muted-foreground">Verified on: {tenantData?.tenant_verification_date || "----"}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
