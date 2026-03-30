import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const message = searchParams.get('message')
  const orderId = searchParams.get('orderId')

  console.error(`Toss Payment Failed: code=${code}, message=${message}, orderId=${orderId}`)
  
  // Track this failure or cancellation in the database
  if (orderId) {
    const supabase = await createClient()
    const status = code === 'PAY_PROCESS_CANCELED' ? 'cancelled' : 'failed'
    
    await supabase.from('payments').update({
       status: status,
       fail_reason: message || code
    }).eq('order_id', orderId)
  }

  // Redirect to the error page so the user can see what happened
  return NextResponse.redirect(new URL(`/payment/error?code=${code}&message=${encodeURIComponent(message || '결제 중 오류가 발생했습니다.')}`, request.url))
}
