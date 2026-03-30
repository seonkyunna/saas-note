import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PrivateLayout from './layout'

// Mock the Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock Icon component
vi.mock('@/components/Icon', () => ({
  default: ({ name }: { name: string }) => <span data-testid="mock-icon">{name}</span>
}))

describe('PrivateLayout', () => {
  it('renders the sidebar navigation links correctly', () => {
    render(
      <PrivateLayout>
        <div data-testid="layout-children">Content</div>
      </PrivateLayout>
    )

    // Verify Brand Logo
    expect(screen.getByText('CloudNote')).toBeDefined()

    // Verify Navigation Links
    expect(screen.getByRole('link', { name: /홈/i }).getAttribute('href')).toBe('/dashboard')
    expect(screen.getByRole('link', { name: /내 메모/i }).getAttribute('href')).toBe('/notes')
    expect(screen.getByRole('link', { name: /설정/i }).getAttribute('href')).toBe('/settings')
    expect(screen.getByRole('link', { name: /구독 관리/i }).getAttribute('href')).toBe('/billing')
    expect(screen.getByRole('link', { name: /고객센터 문의/i }).getAttribute('href')).toBe('/support')
  })

  it('renders children within the main content wrapper', () => {
    render(
      <PrivateLayout>
        <div data-testid="layout-children">Layout Inner Content</div>
      </PrivateLayout>
    )

    expect(screen.getByTestId('layout-children')).toBeDefined()
    expect(screen.getByText('Layout Inner Content')).toBeDefined()
  })
})
