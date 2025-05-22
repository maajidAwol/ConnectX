"use client"
import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useMerchantStore } from "@/store/merchantStore"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function MerchantDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { merchant, loading, error, fetchMerchantDetails, updateMerchantStatus, approveMerchant } = useMerchantStore()

  useEffect(() => {
    if (params.id) {
      fetchMerchantDetails(params.id as string)
    }
  }, [params.id, fetchMerchantDetails])

  const handleStatusChange = async (newStatus: "pending" | "under_review" | "rejected") => {
    if (!merchant) return

    try {
      await updateMerchantStatus(merchant.id, newStatus)
      toast.success(`Merchant status updated to ${newStatus}`)
      // Reload the merchant details
      await fetchMerchantDetails(merchant.id)
    } catch (error) {
      toast.error("Failed to update merchant status")
    }
  }

  const handleApprove = async () => {
    if (!merchant) return

    try {
      await approveMerchant(merchant.id)
      toast.success("Merchant approved successfully")
      // Reload the merchant details
      await fetchMerchantDetails(merchant.id)
    } catch (error) {
      toast.error("Failed to approve merchant")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Back button */}
          <div>
            <Skeleton className="h-8 w-[250px] mb-2" /> {/* Merchant name */}
            <Skeleton className="h-4 w-[150px]" /> {/* Subtitle */}
          </div>
        </div>

        {/* Main content skeleton - 2 column layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Business Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-[200px]" /> {/* Card title */}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status section */}
              <div>
                <Skeleton className="h-5 w-[80px] mb-2" /> {/* Section title */}
                <Skeleton className="h-6 w-[120px] rounded-full" /> {/* Status badge */}
              </div>

              {/* Business details section */}
              <div>
                <Skeleton className="h-5 w-[150px] mb-2" /> {/* Section title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[85%]" />
                  <Skeleton className="h-4 w-[70%]" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              </div>

              {/* Documents section */}
              <div>
                <Skeleton className="h-5 w-[180px] mb-2" /> {/* Section title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-8 w-[60px] rounded-md" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-8 w-[60px] rounded-md" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-8 w-[60px] rounded-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Financial Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-[250px]" /> {/* Card title */}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact details section */}
              <div>
                <Skeleton className="h-5 w-[130px] mb-2" /> {/* Section title */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" /> {/* Icon */}
                    <Skeleton className="h-4 w-[200px]" /> {/* Email */}
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" /> {/* Icon */}
                    <Skeleton className="h-4 w-[150px]" /> {/* Phone */}
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" /> {/* Icon */}
                    <Skeleton className="h-4 w-[250px]" /> {/* Address */}
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" /> {/* Icon */}
                    <Skeleton className="h-4 w-[180px]" /> {/* Website */}
                  </div>
                </div>
              </div>

              {/* Tax information section */}
              <div>
                <Skeleton className="h-5 w-[130px] mb-2" /> {/* Section title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
              </div>

              {/* Bank information section */}
              <div>
                <Skeleton className="h-5 w-[150px] mb-2" /> {/* Section title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[220px]" />
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[100px] mb-2" /> {/* Card title */}
            <Skeleton className="h-4 w-[250px]" /> {/* Card description */}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-[150px] rounded-md" /> {/* Button */}
              <Skeleton className="h-10 w-[150px] rounded-md" /> {/* Button */}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !merchant) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || "Merchant not found"}</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{merchant.name}</h2>
          <p className="text-muted-foreground">Merchant Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Business Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Status</h4>
              {merchant.tenant_verification_status === "unverified" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Unverified</span>
                </Badge>
              )}
              {merchant.tenant_verification_status === "pending" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Pending Review</span>
                </Badge>
              )}
              {merchant.tenant_verification_status === "under_review" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Under Review</span>
                </Badge>
              )}
              {merchant.tenant_verification_status === "approved" && (
                <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Approved</span>
                </Badge>
              )}
              {merchant.tenant_verification_status === "rejected" && (
                <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  <span>Rejected</span>
                </Badge>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Business Details</h4>
              <div className="space-y-1">
                {merchant.legal_name && <p className="text-sm">Legal Name: {merchant.legal_name}</p>}
                {merchant.business_type && <p className="text-sm">Business Type: {merchant.business_type}</p>}
                {merchant.business_registration_number && (
                  <p className="text-sm">Registration #: {merchant.business_registration_number}</p>
                )}
                {merchant.business_bio && <p className="text-sm">Bio: {merchant.business_bio}</p>}
                {merchant.licence_registration_date && (
                  <p className="text-sm">
                    License Date: {new Date(merchant.licence_registration_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Verification Documents</h4>
              <div className="space-y-2">
                {merchant.business_registration_certificate_url && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Business Registration</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={merchant.business_registration_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                  </div>
                )}
                {merchant.tax_registration_certificate_url && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Tax Registration</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={merchant.tax_registration_certificate_url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                )}
                {merchant.id_card_url && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">ID Card</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={merchant.id_card_url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Contact & Financial Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Contact Details</h4>
              <div className="space-y-1">
                <p className="text-sm flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {merchant.email}
                </p>
                {merchant.phone && (
                  <p className="text-sm flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {merchant.phone}
                  </p>
                )}
                {merchant.address && (
                  <p className="text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {merchant.address}
                  </p>
                )}
                {merchant.website_url && (
                  <p className="text-sm flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <a
                      href={merchant.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {merchant.website_url}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Tax Information</h4>
              <div className="space-y-1">
                {merchant.tin_number && <p className="text-sm">TIN: {merchant.tin_number}</p>}
                {merchant.vat_number && <p className="text-sm">VAT: {merchant.vat_number}</p>}
                {merchant.tax_office_address && <p className="text-sm">Tax Office: {merchant.tax_office_address}</p>}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Bank Information</h4>
              <div className="space-y-1">
                {merchant.bank_name && <p className="text-sm">Bank: {merchant.bank_name}</p>}
                {merchant.bank_account_name && <p className="text-sm">Account Name: {merchant.bank_account_name}</p>}
                {merchant.bank_account_number && <p className="text-sm">Account #: {merchant.bank_account_number}</p>}
                {merchant.bank_branch && <p className="text-sm">Branch: {merchant.bank_branch}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Update merchant verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {(merchant.tenant_verification_status === "pending" ||
              merchant.tenant_verification_status === "under_review") && (
              <>
                <Select
                  value={merchant.tenant_verification_status}
                  onValueChange={(value: "pending" | "under_review") => handleStatusChange(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="destructive" onClick={() => handleStatusChange("rejected")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Application
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Application
                </Button>
              </>
            )}
            {merchant.tenant_verification_status === "approved" && (
              <Button variant="destructive" onClick={() => handleStatusChange("rejected")}>
                <XCircle className="mr-2 h-4 w-4" />
                Revoke Approval
              </Button>
            )}
            {merchant.tenant_verification_status === "rejected" && (
              <Button onClick={() => handleStatusChange("under_review")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Reconsider Application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
