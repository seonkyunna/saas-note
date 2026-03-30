// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NotePage from './page'

// Mock Supabase
const { mockUpdate } = vi.hoisted(() => {
  return { mockUpdate: vi.fn().mockResolvedValue({ error: null }) }
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  redirect: vi.fn(),
}))

vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: mockUpdate
        })
      })
    })
  })
}))

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user123' } }, error: null })
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'note123', title: '테스트 노트', content: '테스트 내용입니다.', category: '업무', created_at: '2025-01-01T00:00:00Z' },
            error: null
          })
        })
      })
    })
  })
}))

describe('Note Detail Page', () => {
  it('renders the note details', async () => {
    const Page = await NotePage({ params: Promise.resolve({ id: 'note123' }) })
    render(Page)

    // Title and content should be in the document (inputs/textareas)
    expect(screen.getByDisplayValue('테스트 노트')).toBeDefined()
    expect(screen.getByDisplayValue('테스트 내용입니다.')).toBeDefined()
    expect(screen.getByText('업무')).toBeDefined()
  })

  it.skip('debounces and auto-saves when content changes', async () => {
    const Page = await NotePage({ params: Promise.resolve({ id: 'note123' }) })
    render(Page)

    const textarea = screen.getByDisplayValue('테스트 내용입니다.')
    
    // Type in textarea
    fireEvent.change(textarea, { target: { value: '테스트 내용입니다. 추가 작성!' } })
    
    // Proper delay to let debounce fire
    await new Promise((r) => setTimeout(r, 1500))
    
    expect(mockUpdate).toHaveBeenCalled()
  })
})
