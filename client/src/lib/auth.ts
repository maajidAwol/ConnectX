"use client"

// This is a simplified authentication simulation for demo purposes
// In a real application, you would use a proper authentication system like NextAuth.js

import { users } from "./data"

export function simulateLogin(email: string, password: string) {
  // In a real app, this would validate credentials against a database
  // For demo purposes, we're just checking if the email exists in our dummy data

  const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    return { success: false, message: "Invalid credentials" }
  }

  // Determine redirect based on user role
  let redirectUrl = "/"

  if (user.role === "admin") {
    redirectUrl = "/admin"
  } else if (user.role === "merchant") {
    redirectUrl = "/merchant"
  }

  return {
    success: true,
    user,
    redirectUrl,
  }
}

export function simulateRegister(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  company: string,
) {
  // In a real app, this would create a new user in the database
  // For demo purposes, we'll just simulate a successful registration

  // Determine role based on email (just for demo)
  const role = email.includes("admin") ? "admin" : "merchant"

  // Determine redirect based on role
  const redirectUrl = role === "admin" ? "/admin" : "/merchant"

  return {
    success: true,
    redirectUrl,
  }
}

// Get current user (simulated)
export function getCurrentUser() {
  // In a real app, this would check session/cookies
  // For demo, we'll just return a hardcoded user based on the URL

  // This is just for demo purposes
  // In a real app, you would use a proper auth system
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""

  if (pathname.startsWith("/admin")) {
    return users.find((user) => user.role === "admin")
  } else if (pathname.startsWith("/merchant")) {
    // For demo, return verified or unverified merchant based on URL
    if (pathname.includes("verified")) {
      return users.find((user) => user.role === "merchant" && user.isVerified)
    }
    return users.find((user) => user.role === "merchant" && !user.isVerified)
  }

  return null
}

// Check if user is logged in
export const isUserLoggedIn = (): boolean => {
  try {
    const token = localStorage.getItem('token')
    return !!token
  } catch (error) {
    console.error('Error checking login status:', error)
    return false
  }
}

// Check if merchant is verified
export const isMerchantVerified = (): boolean => {
  // In a real implementation, this would check user data from an auth context/store
  // For now using localStorage, but in production this should be properly implemented
  try {
    const userData = localStorage.getItem('user')
    if (!userData) return false
    
    const user = JSON.parse(userData)
    return user.isVerified === true
  } catch (error) {
    console.error('Error checking verification status:', error)
    return false
  }
}
