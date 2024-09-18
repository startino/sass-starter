import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import { createBrowserClient } from "@supabase/ssr"
import { redirect } from "@sveltejs/kit"

import type { Tables } from "$lib/supabase/supabase.types"

export const load = async ({ data, depends, url }) => {
  depends("supabase:auth")

  const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const profile: Tables<"profiles"> | null = data.profile

  const createProfilePath = "/account/create_profile"
  const signOutPath = "/account/sign_out"
  if (
    profile &&
    !_hasFullProfile(profile) &&
    url.pathname !== createProfilePath &&
    url.pathname !== signOutPath
  ) {
    redirect(303, createProfilePath)
  }

  return { supabase, session, profile }
}

export const _hasFullProfile = (profile: Tables<"profiles"> | null) => {
  if (!profile) {
    return false
  }
  if (!profile.full_name) {
    return false
  }
  if (!profile.company_name) {
    return false
  }
  if (!profile.website) {
    return false
  }

  return true
}
