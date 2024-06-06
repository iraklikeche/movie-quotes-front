export type User = {
  id: number
  username: string
  profile_image_url: string
}

export type Genre = {
  id: number
  name: string
}

export type Movie = {
  id: number
  movie_name: string
  name: {
    en: string
    ka?: string
  }
  image_url: string
  year: number
  director: string
  genres: Genre[]
}

export type Comment = {
  id: number
  content: string
  user_id: number
  quote_id: number
  user: User
}

export type Like = {
  id: number
  user_id: number
  quote_id: number
}

export type Quote = {
  id: number
  content: {
    en: string
    ka?: string
  }
  user: User
  movie: Movie
  comments: Comment[]
  likes: Like[]
  image_url: string
  liked_by_user: boolean
  like_count: number
  likes_count: number
  comments_count: number
  movie_id: string
}

export type UserRegistration = {
  email: string
  password: string
  password_confirmation: string
}

export type UserCredentials = {
  login: string
  password: string
  remember?: boolean
}

export type ResetPasswordData = {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export type CheckTokenData = {
  token: string
  email?: string
}

export type UserProfileUpdate = {
  name?: string
  email?: string
  new_password?: string
  new_password_confirmation?: string
}

export type QuoteLikedEvent = {
  quote: PartialQuote
  user: User
  message: string
  reacted: boolean
  read_at: string | null
  time: string
  likeCount: number
}

export type QuoteUnlikedEvent = QuoteLikedEvent

export type QuoteCommentedEvent = {
  quote: PartialQuote
  comment: {
    id: number
    content: string
    user_id: number
    quote_id: number
    user: User
  }
  user: User
  message: string
  commentCount: number
  commented: boolean
  read_at: string | null
  time: string
}

export type NotificationData = {
  user: User
  message: string
  reacted?: boolean
  commented?: boolean
  quote_id?: number
}

export type Notification = {
  id: number
  data: NotificationData
  read_at: string | null
  created_at: string
  time: string
}

export type PartialQuote = {
  id: number
  content: {
    en: string
    ka?: string
  }
  image_url: string
  movie_id: number
  user_id: number
  likes_count?: number
  comments_count?: number
}
