export type Work = {
    work_id: string
    title: string
    author_id: string
    description: string | null
    cover_image_url: string | null
    published_date: Date | null
}

export interface WorkEntity extends Work {
    created_at: Date
    updated_at: Date
}
