-- billing_keys 테이블 생성
CREATE TABLE IF NOT EXISTS public.billing_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    billing_key TEXT NOT NULL,
    customer_key TEXT NOT NULL,
    card_number TEXT,          -- 마스킹된 카드번호 (예: 4330****1234)
    card_company TEXT,         -- 카드사 이름
    method TEXT DEFAULT 'CARD', -- 결제 수단
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)             -- 사용자당 하나의 빌링키만 활성 유지
);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER set_billing_keys_updated_at
    BEFORE UPDATE ON public.billing_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- RLS 활성화
ALTER TABLE public.billing_keys ENABLE ROW LEVEL SECURITY;

-- 본인 빌링키만 조회 가능
CREATE POLICY "Users can view own billing keys" ON public.billing_keys
    FOR SELECT
    USING (auth.uid() = user_id);

-- 본인 빌링키 삽입 허용 (최초 카드 등록 시)
CREATE POLICY "Users can insert own billing keys" ON public.billing_keys
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 본인 빌링키 수정 허용 (카드 재등록 시 upsert)
CREATE POLICY "Users can update own billing keys" ON public.billing_keys
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- users 테이블에 next_billing_at 컬럼 추가 (정기결제일)
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS next_billing_at TIMESTAMPTZ;

-- payments 테이블에 billing_type 컬럼 추가 (단일/정기 구분)
ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS billing_type TEXT DEFAULT 'billing';
