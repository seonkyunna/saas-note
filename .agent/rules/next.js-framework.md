---
description: Next.js App Router 프레임워크 베스트 프랙티스 및 개발 컨벤션 룰
---

# Next.js App Router 프레임워크 가이드라인 및 룰

## 1. 핵심 원칙 (Core Principles)
*   **Server Component 우선 (Default to Server Components):** 기본적으로 모든 컴포넌트는 서버 컴포넌트로 작성합니다. 컴포넌트 내부에 상태(`useState`), 생명주기 훅(`useEffect`), 브라우저 전용 API(DOM, window 등) 혹은 이벤트 리스너(`onClick` 등)가 필수적으로 필요한 경우에만 파일 최상단에 `"use client"`를 선언하여 클라이언트 컴포넌트로 전환합니다.
*   **가독성 높고 간결한 코드:** 불필요한 추상화나 지나친 단축 구문을 피하고, 누구나 읽고 흐름을 이해할 수 있는 직관적인 코드를 작성합니다.
*   **파일 모듈화 및 책임 분리:** 하나의 파일에 너무 많은 코드나 뷰(View)가 섞여 비대해지면, 독립된 기능이나 하위 컴포넌트, Custom Hook, 유틸리티 함수 등으로 여러 파일로 적절히 나누어(Split) 단일 책임 원칙을 유지합니다.

## 2. Server & Client Components 최적화
*   **Client Component는 트리 말단(Leaf)으로 밀어내기:** 클라이언트 JS 번들 사이즈 증가를 막기 위해, 상위 레이아웃은 서버 컴포넌트로 두고 상호작용이 필요한 아주 작은 UI 요소(예: 찜하기 버튼, 탭 토글, 입력 폼 컴포넌트 등)만 클라이언트 컴포넌트로 분리합니다.
*   **직렬화(Serialization) 불가능한 데이터 전달 금지:** Server Component에서 Client Component로 `props`를 넘길 때, 함수(Function), `Date` 객체, `Set`, `Map` 등 직렬화할 수 없는 데이터는 전달할 수 없습니다. 필요한 경우 JSON으로 변환 가능한 일반 객체 배열, 문자열 등으로 매핑하여 전달합니다.

## 3. 라우팅 및 데이터 페칭 (Data Fetching)
*   **올바른 위치에서의 데이터 페칭:** 데이터 가져오기 작업(Fetch)은 가급적 Server Component 최상단에서 `async/await`를 사용하여 수행하여 성능 이점을 취합니다. 클라이언트에서 해야 할 경우 SWR이나 React Query를 사용합니다.
*   **특수 파일(Special Files) 적극 활용:** 로딩 상태 처리는 `loading.tsx`, 에러 바운더리는 `error.tsx`, 데이터가 없을 때는 `not-found.tsx` 규칙을 활용하여 폴백(Fallback) UI 구조를 선언적이고 일관되게 구성합니다.
*   **URL 상태 (Query Parameters) 활용:** 필터 정보나 페이지네이션, 모달 열림 여부 등 공유하기 좋은 상태는 전역 상태 라이브러리(Zustand 등)보다 URL 매개변수를 활용하여 SSR과 호환되게 만듭니다.

## 4. Next.js 빌트인(Built-in) 최적화 도구 사용
*   **이미지 최적화:** 일반 `<img>` 태그 대신 Next.js의 `next/image` (`<Image>`) 컴포넌트를 사용하여 자동 WebP/AVIF 변환, Lazy Loading 적용을 필수로 합니다.
*   **네비게이션:** 일반 네이티브 앵커 `<a href="...">` 태그 대신 항상 `next/link` (`<Link>`) 컴포넌트를 사용하여 클라이언트 네비게이션과 페이지 뷰 프리패칭(Prefetching)을 활성화합니다.
*   **폰트:** 외부 폰트 파일 이용 시, `next/font` 모듈을 도입하여 Layout Shift(CLS) 현상을 방지합니다.

## 5. 데이터 변경 (Data Mutations)
*   **Server Actions 우선 활용 권장:** 간단한 폼 제출이나 데이터 수정 작업 시, 별도로 API Routes(`app/api/...`)를 파서 fetch 요청을 주고받기보다는 `app/` 라우터가 제공하는 **Server Actions** (`"use server"`)를 선호합니다. 이를 통해 코드 베이스를 간결화하고 클라이언트 자바스크립트에 의존치 않는 프로그레시브 인핸스먼트를 보장합니다.
