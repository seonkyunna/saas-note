import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NotesLayout from './layout'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn()
  }))
}))

// Mock Supabase
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user123', email: 'test@cloudnote.com' } }, error: null })
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [
              { id: '1', title: '주간 회의록', content: '회의 내용', created_at: '2025-01-01T00:00:00Z' },
              { id: '2', title: '마케팅 기획안', content: '기획안 내용', created_at: '2025-01-02T00:00:00Z' }
            ],
            error: null
          })
        })
      })
    })
  })
}))

vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn().mockReturnValue({})
}))

describe('Notes Layout', () => {
  it('renders the sidebar note list and new note button', async () => {
    const Layout = await NotesLayout({ children: <div data-testid="child-content">Child</div> })
    render(Layout)

    // Sidebar
    expect(screen.getByText('내 노트')).toBeDefined()
    expect(screen.getByText('새 노트')).toBeDefined()
    
    // Notes List
    expect(screen.getByText('주간 회의록')).toBeDefined()
    expect(screen.getByText('마케팅 기획안')).toBeDefined()
    
    // Children
    expect(screen.getByTestId('child-content')).toBeDefined()
  })
})
