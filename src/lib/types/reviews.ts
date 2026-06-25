export type CreateProductReviewInput = {
  rating: number
  title?: string
  content?: string
  reviewer_name?: string
  reviewer_email?: string
  metadata?: Record<string, unknown>
}

export type ProductReviewSubmissionResult = {
  productId: string
  alreadyReviewed?: boolean
  message?: string
  success?: boolean
}
