"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/dashboard-layout"
import merchantSettings from '@/data/merchant-settings.json'
import {
  BarChart3,
  Box,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
} from "lucide-react"

const navigation = [
  {
    title: "Dashboard",
    href: "/merchant/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/merchant/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/merchant/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/merchant/customers",
    icon: Users,
  },
  {
    title: "Stock",
    href: "/merchant/stock",
    icon: Box,
  },
  {
    title: "Analytics",
    href: "/merchant/analytics",
    icon: BarChart3,
  },
  {
    title: "Marketing",
    href: "/merchant/marketing",
    icon: Tag,
  },
  {
    title: "Account",
    href: "/merchant/account",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/merchant/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/merchant/help",
    icon: HelpCircle,
  },
]

export default function AccountPage() {
  const [businessProfile, setBusinessProfile] = useState(merchantSettings.businessProfile)
  const [teamMembers, setTeamMembers] = useState(merchantSettings.teamMembers)
  const [subscription, setSubscription] = useState(merchantSettings.subscription)
  const [isEditing, setIsEditing] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
    permissions: [],
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // Here you would typically make an API call to update the profile
    console.log("Profile updated:", businessProfile)
  }

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = Math.max(...teamMembers.map(m => m.id)) + 1
    setTeamMembers([...teamMembers, { ...newMember, id: newId }])
    setNewMember({
      name: "",
      email: "",
      role: "",
      status: "Active",
      permissions: [],
    })
  }

  const handleDeleteTeamMember = (id: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id))
  }

  const handleUpdateSubscription = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to update the subscription
    console.log("Subscription updated:", subscription)
  }

  return (
    <DashboardLayout navigation={navigation} role="merchant">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Account & Business Management</h1>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit2 className="mr-2 h-4 w-4" />}
            {isEditing ? "Save Changes" : "Edit"}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Business Profile</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          {/* Business Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>Update your business information and branding</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={businessProfile.companyName}
                        onChange={(e) => setBusinessProfile({ ...businessProfile, companyName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Input
                        id="businessType"
                        value={businessProfile.businessType}
                        onChange={(e) => setBusinessProfile({ ...businessProfile, businessType: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={businessProfile.taxId}
                        onChange={(e) => setBusinessProfile({ ...businessProfile, taxId: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={businessProfile.contact.website}
                        onChange={(e) => setBusinessProfile({
                          ...businessProfile,
                          contact: { ...businessProfile.contact, website: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        placeholder="Street"
                        value={businessProfile.address.street}
                        onChange={(e) => setBusinessProfile({
                          ...businessProfile,
                          address: { ...businessProfile.address, street: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                      <Input
                        placeholder="City"
                        value={businessProfile.address.city}
                        onChange={(e) => setBusinessProfile({
                          ...businessProfile,
                          address: { ...businessProfile.address, city: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                      <Input
                        placeholder="State"
                        value={businessProfile.address.state}
                        onChange={(e) => setBusinessProfile({
                          ...businessProfile,
                          address: { ...businessProfile.address, state: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                      <Input
                        placeholder="ZIP Code"
                        value={businessProfile.address.zipCode}
                        onChange={(e) => setBusinessProfile({
                          ...businessProfile,
                          address: { ...businessProfile.address, zipCode: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                      <Input
                        placeholder="Country"
                        value={businessProfile.address.country}
                        onChange={(e) => setBusinessProfile({
                          ...businessProfile,
                          address: { ...businessProfile.address, country: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Contact Information</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        placeholder="Email"
                        value={businessProfile.contact.email}
                        onChange={(e) => setBusinessProfile({
                          ...businessProfile,
                          contact: { ...businessProfile.contact, email: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                      <Input
                        placeholder="Phone"
                        value={businessProfile.contact.phone}
                        onChange={(e) => setBusinessProfile({
                          ...businessProfile,
                          contact: { ...businessProfile.contact, phone: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage team members and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <form onSubmit={handleAddTeamMember} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium">Add New Team Member</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newMemberName">Name</Label>
                        <Input
                          id="newMemberName"
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newMemberEmail">Email</Label>
                        <Input
                          id="newMemberEmail"
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newMemberRole">Role</Label>
                        <Input
                          id="newMemberRole"
                          value={newMember.role}
                          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Team Member
                    </Button>
                  </form>

                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{member.role}</Badge>
                            <Badge variant="outline">{member.status}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTeamMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSubscription} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-sm text-gray-500">{subscription.currentPlan}</p>
                    </div>
                    <Badge variant="secondary">{subscription.status}</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="flex items-center gap-2">
                      <span>•••• {subscription.paymentMethod.last4}</span>
                      <span className="text-sm text-gray-500">Expires {subscription.paymentMethod.expiry}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Usage</Label>
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span>Products</span>
                        <span>{subscription.usage.products}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage</span>
                        <span>{subscription.usage.storage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Calls</span>
                        <span>{subscription.usage.apiCalls}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Features</Label>
                    <div className="grid gap-2">
                      {subscription.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">Upgrade Plan</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 