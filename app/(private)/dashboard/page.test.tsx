import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DashboardPage from './page'

// Mock Supabase
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user123', email: 'test@test.com' } }, error: null })
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'user123', full_name: '홍길동', plan_type: 'Pro', storage_used: 3435973836 },
            error: null
          }),
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [
                { id: '1', title: '회의록', created_at: '2025-01-01T00:00:00Z', is_ai_summarized: false }
              ],
              error: null
            })
          })
        })
      })
    })
  })
}))

describe('Dashboard Page', () => {
  it('renders the dashboard widgets with Supabase data', async () => {
    // Dashboard is a React Server Component, we need to await it
    const Page = await DashboardPage()
    render(Page)

    // Welcome text
    expect(screen.getByText(/안녕하세요/i)).toBeDefined()
    
    // Subscription Card
    expect(screen.getByText('구독 현황')).toBeDefined()
    expect(screen.getByText('다음 결제일')).toBeDefined()
    expect(screen.getByText('월 결제 금액')).toBeDefined()
    
    // Usage Card
    expect(screen.getByText('이번 달 사용량')).toBeDefined()
    expect(screen.getByText('메모 개수')).toBeDefined()
    expect(screen.getByText('저장공간')).toBeDefined()
    expect(screen.getByText('AI 요약')).toBeDefined()
    
    // Recent Activity Card
    expect(screen.getByText('최근 활동')).toBeDefined()
    expect(screen.getByText('전체 보기')).toBeDefined()
  })
})
