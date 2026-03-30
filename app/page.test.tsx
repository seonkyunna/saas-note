import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LandingPage from './page'

describe('Landing Page', () => {
  it('renders the header correctly', () => {
    render(<LandingPage />)
    expect(screen.getByText('CloudNote')).toBeDefined()
    expect(screen.getByText('로그인')).toBeDefined()
  })

  it('renders the hero section with main catchphrase', () => {
    render(<LandingPage />)
    expect(screen.getByText('당신의 아이디어를 클라우드에')).toBeDefined()
    expect(screen.getByText('어디서든 메모하고, AI가 정리해드립니다')).toBeDefined()
    expect(screen.getByText('무료로 시작하기')).toBeDefined()
  })

  it('renders the pricing plans', () => {
    render(<LandingPage />)
    expect(screen.getByText('요금제')).toBeDefined()
    expect(screen.getByText('Free')).toBeDefined()
    expect(screen.getByText('Pro')).toBeDefined()
    expect(screen.getByText('Enterprise')).toBeDefined()
    
    // verify some features render
    expect(screen.getByText('메모 100개')).toBeDefined()
    expect(screen.getByText('메모 무제한')).toBeDefined()
  })

  it('renders the footer', () => {
    render(<LandingPage />)
    expect(screen.getByText('© CloudNote')).toBeDefined()
    expect(screen.getByText('이용약관')).toBeDefined()
    expect(screen.getByText('개인정보처리방침')).toBeDefined()
  })
})
