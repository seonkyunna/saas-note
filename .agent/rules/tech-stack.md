---
trigger: always_on
description: Next.js + Supabase 프로젝트 기술 스택(Tech Stack) 및 원칙
---

# 🛠️ 기술 스택 (Tech Stack) 및 원칙

본 프로젝트의 주력 기술 스택은 **Next.js (App Router)**와 **Supabase**입니다. 이 두 기술을 조화롭게 사용하기 위한 핵심 원칙과 베스트 프랙티스를 정의합니다.

## 1. 프론트엔드 핵심 프레임워크: Next.js (App Router)

Next.js는 React 기반의 풀스택 프레임워크로, 서버 컴포넌트(Server Components)와 라우팅 최적화를 통해 강력한 성능을 제공합니다. (세부 룰은 `next.js-framework.md` 파일 참고)

* **권장 활용:**
  * 초기 데이터 로딩, SEO 최적화가 필요한 페이지 렌더링.
  * API 엔드포인트 구축을 대체하는 Server Actions 활용.
  * 경험치와 직결되는 이미지 최적화(`<Image>`)와 라우팅.

## 2. 백엔드/BaaS: Supabase

Supabase는 PostgreSQL 기반의 오픈소스 Firebase 대안으로, 데이터베이스, 인증(Auth), 스토리지(Storage), 엣지 함수(Edge Functions) 등을 제공합니다.

* **권장 활용:**
  * **PostgreSQL 데이터베이스:** 프로젝트의 메인 DB로 사용합니다. 강력한 관계형 모델링을 지원합니다.
  * **인증 (Auth):** 이메일/비밀번호, 소셜 로그인 등 사용자 인증 처리에 사용합니다.
  * **Row Level Security (RLS):** 보안의 핵심입니다. **클라이언트 측 코드를 복잡하게 만드는 대신 데이터베이스 단에서 RLS 정책을 강력하게 설정하여 보안을 유지합니다.**
  * **실시간 구독 (Realtime):** 변경되는 데이터를 즉각 반영해야 할 때 활용합니다 (예: 채팅, 현재 접속자 수, 장바구니 변경 내용 즉시 반영 등).
* 마이그레이션 (migrations)
  * supabase/mugrations 폴더에 위치
  * 마이그레이션을 수정하거나 삭제하거나 새로 생성할때는 항상 사용자의 허가 받기

## 3. 강력한 원칙: 데이터 접근 분리 (Server vs Client)

Next.js의 Server Component와 Client Component 환경에서 Supabase를 다루는 방식에 명확한 기준을 둡니다.

* **Server Component에서 접근 (권장):**
  * `ssr` 패키지(예: `@supabase/ssr`)를 사용하여 페이지 로드 시점에 필요한 데이터를 서버 측에서 안전하게 가져옵니다.
  * 민감한 API Key 노출 없이 `process.env.SUPABASE_SERVICE_ROLE_KEY` (필요시 매우 제한적으로) 노출을 막고 데이터를 페칭합니다.
  * 보안 관련 작업(인증 정보 확인)은 가급적 미들웨어(`middleware.ts`)나 서버 컴포넌트 단위에서 처리하여 초기 랜더링 속도와 보안성을 높입니다.

* **Client Component에서 접근:**
  * 사용자의 입력이나 실시간 상호작용(Realtime Subscription)으로 인해 데이터베이스 수정/조회가 즉각적으로 이루어져야 할 때만 클라이언트 컴포넌트에서 접근합니다.
  * `"use client"` 파일에서는 반드시 사용자 권한 기반의 토큰 통신만을 수행해야 하므로 **RLS(Row Level Security)** 정책의 철저한 관리가 선행되어야 합니다.

## 4. 데이터 페칭 라이브러리 (필요시)

Server Component로 데이터를 패칭하는 것을 원칙으로 하지만, Client Component 환경 내에서 강력한 캐싱과 상태 관리가 불가피한 요구사항(예: 복잡한 무한스크롤 표 출력) 시 **React Query (또는 SWR)** 도입을 고려합니다.
(현재 프로젝트 특성에 따라 Server Component/Server Action으로 처리 가능한 부분을 우선순위로 합니다.)

## 5. UI/Styling: Tailwind CSS

빠른 프로토타이핑과 일관된 디자인 시스템 적용을 위해 **Tailwind CSS**를 기본 스타일링 도구로 사용합니다.

* **원칙:** 인라인 `style` 속성 사용은 극히 제한(동적 위치 변화 등)하고, 컴포넌트 재사용성을 위해 너무 긴 클래스 명 집합은 분리하여 관리합니다.

## 6. 타입 시스템 (TypeScript)

모든 코드는 **TypeScript**를 엄격하게 적용하여 컴파일 타임에 오류를 잡고, 안정성과 문서화 효과를 가져갑니다.

* **원칙:** `any` 타입 사용을 극도로 제한하고, Supabase에서 연동된 제네릭 기반의 엔티티 타입(`Database` 타입 정의 등)을 활용해 DB 스키마와 프론트엔드 데이터 타입의 불일치를 사전에 방지합니다.
