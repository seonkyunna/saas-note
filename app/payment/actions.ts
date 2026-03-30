'use server'

import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

export async function createPendingPayment(amount: number) {
  const supabase = await createClient()

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  // 2. Generate a highly unique orderId
  // Toss requires orderId to be 6-64 characters.
  const orderId = `cloudnote_order_${new Date().getTime()}_${crypto.randomUUID().substring(0, 8)}`

  // 3. Insert pending payment record
  const { error: insertError } = await supabase
    .from('payments')
    .insert({
      user_id: user.id,
      order_id: orderId,
      amount: amount,
      status: 'pending'
    })

  if (insertError) {
    console.error('Failed to create pending payment record:', insertError)
    throw new Error('결제 정보를 초기화할 수 없습니다. 다시 시도해주세요.')
  }

  // 4. Return the generated orderId to the client
  return { orderId }
}

/**
 * 빌링키 발급을 위한 customerKey 반환
 * - 사용자 ID를 기반으로 고정된(deterministic) customerKey 생성
 * - 토스페이먼츠 정책상 UUID처럼 충분히 무작위적인 값이어야 하므로
 *   user.id(UUID)를 그대로 사용합니다.
 */
export async function getBillingCustomerKey(): Promise<{ customerKey: string; userEmail: string; userName: string }> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  // customerKey = user UUID (이미 충분히 무작위, 36자)
  const customerKey = user.id

  // 사용자 정보 조회
  const { data: profile } = await supabase
    .from('users')
    .select('email, full_name')
    .eq('id', user.id)
    .single()

  return {
    customerKey,
    userEmail: profile?.email || user.email || '',
    userName: profile?.full_name || user.email?.split('@')[0] || '사용자',
  }
}

