"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(merchantSettings.notifications)
  const [isEditing, setIsEditing] = useState(false)

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // Here you would typically make an API call to update the notifications
    console.log("Notifications updated:", notifications)
  }

  return (
    <DashboardLayout navigation={navigation} role="merchant">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Save Changes" : "Edit"}
          </Button>
        </div>

        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailEnabled">Enable Email Notifications</Label>
                        <Switch
                          id="emailEnabled"
                          checked={notifications.email.enabled}
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              email: { ...notifications.email, enabled: checked }
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="orderUpdates">Order Updates</Label>
                          <Switch
                            id="orderUpdates"
                            checked={notifications.email.orderUpdates}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                email: { ...notifications.email, orderUpdates: checked }
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                          <Switch
                            id="inventoryAlerts"
                            checked={notifications.email.inventoryAlerts}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                email: { ...notifications.email, inventoryAlerts: checked }
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="customerMessages">Customer Messages</Label>
                          <Switch
                            id="customerMessages"
                            checked={notifications.email.customerMessages}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                email: { ...notifications.email, customerMessages: checked }
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="marketingUpdates">Marketing Updates</Label>
                          <Switch
                            id="marketingUpdates"
                            checked={notifications.email.marketingUpdates}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                email: { ...notifications.email, marketingUpdates: checked }
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">SMS Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smsEnabled">Enable SMS Notifications</Label>
                        <Switch
                          id="smsEnabled"
                          checked={notifications.sms.enabled}
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              sms: { ...notifications.sms, enabled: checked }
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="smsOrderUpdates">Order Updates</Label>
                          <Switch
                            id="smsOrderUpdates"
                            checked={notifications.sms.orderUpdates}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                sms: { ...notifications.sms, orderUpdates: checked }
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="smsInventoryAlerts">Inventory Alerts</Label>
                          <Switch
                            id="smsInventoryAlerts"
                            checked={notifications.sms.inventoryAlerts}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                sms: { ...notifications.sms, inventoryAlerts: checked }
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="smsCustomerMessages">Customer Messages</Label>
                          <Switch
                            id="smsCustomerMessages"
                            checked={notifications.sms.customerMessages}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                sms: { ...notifications.sms, customerMessages: checked }
                              })
                            }
                          />
                        </div>
                      </div>
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

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Configure your system preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <select className="w-full rounded-md border border-gray-200 p-2">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <select className="w-full rounded-md border border-gray-200 p-2">
                      <option value="utc">UTC</option>
                      <option value="est">Eastern Time</option>
                      <option value="pst">Pacific Time</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <select className="w-full rounded-md border border-gray-200 p-2">
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Two-Factor Authentication</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Add an extra layer of security to your account</span>
                      <Switch />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Session Management</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Manage active sessions</span>
                      <Button variant="outline">View Sessions</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Change your password</span>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

