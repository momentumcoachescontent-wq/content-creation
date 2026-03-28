export type ContentAsset = {
  id: string
  brief_id: string
  platform: string
  format: string
  hook: string | null
  body: string | null
  cta: string | null
  status: string
  quality_score: number
  risk_score: number
  review_notes: string | null
  buffer_id: string | null
  published_at: string | null
  created_at: string
}

export type AssetSummary = {
  pending_review: number
  pending_approval: number
  approved: number
  rejected: number
  scheduled: number
  publish_error: number
}

export type AssetSummaryResponse = {
  ok: boolean
  summary: AssetSummary
  total: number
}