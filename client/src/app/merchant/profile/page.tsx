"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Building, Calendar, Check, Edit, Globe, Mail, Phone, ShieldCheck, Upload } from "lucide-react"
import { businessProfile, isMerchantVerified } from "@/lib/data"

export default function BusinessProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const isVerified = isMerchantVerified()

  // Use the appropriate profile data based on verification status
  const profile = isVerified ? businessProfile.verified : businessProfile.unverified

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
                    {profile.verificationStatus}
                  </Badge>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue={profile.companyName} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="business-type">Business Type</Label>
                      <Input id="business-type" defaultValue={profile.businessType} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="founded-year">Founded Year</Label>
                      <Input id="founded-year" type="number" defaultValue={profile.foundedYear} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea id="description" defaultValue={profile.description} rows={4} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Company Name:</span>
                      <span>{profile.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Business Type:</span>
                      <span>{profile.businessType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Founded:</span>
                      <span>{profile.foundedYear}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">Description:</div>
                      <p className="text-sm text-muted-foreground">{profile.description}</p>
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
                      <Input id="contact-email" type="email" defaultValue={profile.contactEmail} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input id="contact-phone" defaultValue={profile.contactPhone} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Textarea id="address" defaultValue={profile.address} rows={2} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue={profile.website} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{profile.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span>{profile.contactPhone}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">Address:</div>
                      <p className="text-sm text-muted-foreground">{profile.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Website:</span>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.website}
                      </a>
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
                      <span>{profile.tinNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Business License:</span>
                      <span>{profile.businessLicense}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Bank Account:</span>
                      <span>{profile.bankAccount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Verified Since:</span>
                      <span>{profile.verifiedSince}</span>
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
                  <Input id="tin-number" placeholder="XX-XXXXXXX" />
                  <p className="text-xs text-muted-foreground">Enter your Ethiopian Tax Identification Number</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="business-license">Business License Number</Label>
                  <Input id="business-license" placeholder="BL-XXXXXXXXX" />
                  <p className="text-xs text-muted-foreground">Enter your business license number</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bank-account">Bank Account Information</Label>
                  <Input id="bank-account" placeholder="XXXX-XXXX-XXXX-XXXX" />
                  <p className="text-xs text-muted-foreground">Enter your business bank account number</p>
                </div>

                <div className="grid gap-2">
                  <Label>Upload Documents</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border border-dashed p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">Business Registration</p>
                        <p className="text-xs text-muted-foreground">Upload your business registration certificate</p>
                        <Button variant="outline" size="sm">
                          Select File
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-md border border-dashed p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
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
                  <p className="mt-2 text-sm text-muted-foreground">Document ID: DOC-12345</p>
                  <p className="text-sm text-muted-foreground">Verified on: January 15, 2023</p>
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
                  <p className="mt-2 text-sm text-muted-foreground">Document ID: DOC-67890</p>
                  <p className="text-sm text-muted-foreground">Verified on: January 15, 2023</p>
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
                  <p className="mt-2 text-sm text-muted-foreground">Document ID: DOC-24680</p>
                  <p className="text-sm text-muted-foreground">Verified on: January 15, 2023</p>
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
