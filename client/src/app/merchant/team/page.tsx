"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, UserPlus, Trash2, ChevronLeft, ChevronRight, Check, X, Loader2 } from "lucide-react"
import useTeamStore from "@/store/useTeamStore"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PasswordValidation {
  hasMinLength: boolean
  hasLetter: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export default function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  })
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false,
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

  const { user } = useAuthStore()
  const isOwner = user?.role === "owner"

  const { members, isLoading, error, currentPage, totalPages, fetchMembers, addMember, deleteMember } = useTeamStore()

  useEffect(() => {
    fetchMembers(currentPage)
  }, [currentPage])

  useEffect(() => {
    // Password validation
    const password = newMember.password
    const validations = {
      hasMinLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    setPasswordValidation(validations)

    // Calculate password strength (0-100)
    const criteriaCount = Object.values(validations).filter(Boolean).length
    setPasswordStrength(password.length ? (criteriaCount / 4) * 100 : 0)
  }, [newMember.password])

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const isFormValid = isPasswordValid && newMember.name && newMember.email && newMember.role

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500"
    if (passwordStrength <= 50) return "bg-orange-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Filter team members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddMember = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!isFormValid) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      await addMember(newMember)
      setNewMember({ name: "", email: "", password: "", role: "member" })
      toast.success("Team member added successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add team member")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMember = async () => {
    if (!memberToDelete) return
    try {
      await deleteMember(memberToDelete)
      setMemberToDelete(null)
      toast.success("Team member deleted successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete team member")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground">Manage your team members and their access levels</p>
        </div>
        {isOwner && (
          <Button
            className="gap-2"
            onClick={() => document.getElementById("invite-form")?.scrollIntoView({ behavior: "smooth" })}
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Team Member</span>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search team members..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-4 rounded-md">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loaders for team members
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-16 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No team members found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-blue-700 font-medium">{member.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="font-medium">{member.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <Badge variant={member.is_active ? "default" : "secondary"}>
                          {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </Button>
                          {isOwner && (
                            <Button variant="ghost" size="icon" onClick={() => setMemberToDelete(member.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMembers(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMembers(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isOwner && (
        <Card id="invite-form">
          <CardHeader>
            <CardTitle>Add New Team Member</CardTitle>
            <CardDescription>Fill in the details below to add a new team member</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                  {newMember.password && (
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Password strength</span>
                        <span
                          className={
                            passwordStrength <= 25
                              ? "text-red-500"
                              : passwordStrength <= 50
                                ? "text-orange-500"
                                : passwordStrength <= 75
                                  ? "text-yellow-500"
                                  : "text-green-500"
                          }
                        >
                          {passwordStrength <= 25
                            ? "Weak"
                            : passwordStrength <= 50
                              ? "Fair"
                              : passwordStrength <= 75
                                ? "Good"
                                : "Strong"}
                        </span>
                      </div>
                      <Progress value={passwordStrength} className={`h-1.5 ${getStrengthColor()}`} />
                      <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                        <div className="flex items-center gap-1">
                          {passwordValidation.hasMinLength ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span
                            className={passwordValidation.hasMinLength ? "text-green-500" : "text-muted-foreground"}
                          >
                            8+ characters
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {passwordValidation.hasLetter ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordValidation.hasLetter ? "text-green-500" : "text-muted-foreground"}>
                            Letters
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {passwordValidation.hasNumber ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordValidation.hasNumber ? "text-green-500" : "text-muted-foreground"}>
                            Numbers
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {passwordValidation.hasSpecial ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordValidation.hasSpecial ? "text-green-500" : "text-muted-foreground"}>
                            Special chars
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={newMember.role}
                    onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                    required
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      {/* <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem> */}
                    </SelectContent>
                  </Select>
                  {/* Empty div to match the height of password validation only when password is entered */}
                  <div className={newMember.password ? "h-[104px]" : ""}></div>
                </div>
              </div>
              <Button type="submit" className="mt-4" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Member...
                  </>
                ) : (
                  "Add Member"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team member? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
