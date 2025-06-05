"use client"

import { useEffect, useState } from "react"

/**
 * Detects if the "session" cookie is present in the browser,
 * and returns true if so.
 */
export function useLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const hasSession = document.cookie.includes("session=")
    setLoggedIn(hasSession)
  }, [])

  return loggedIn
}
