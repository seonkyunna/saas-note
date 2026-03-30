---
description: Next.js App Router 환경에서의 Feature-First 클린 아키텍처 폴더 구조 및 규칙
---

# 🏛 프론트엔드 클린 아키텍처 규칙 (Next.js App Router)

본 프로젝트는 Next.js App Router 환경의 특성을 살리면서 비즈니스 로직을 완벽히 분리하는 **Feature-First 클린 아키텍처**를 지향합니다.

## 📂 기본 폴더 구조 원칙

최상위에는 `app/` 폴더와 `src/` 폴더를 분리하여 운영합니다.

*   `app/`: 라우팅과 진입점(Entry Point), Layout, DI(Dependency Injection) 역할만 담당. 비즈니스 로직 금지.
*   `src/`: 실제 비즈니스 로직, UI 컴포넌트, 공통 모듈이 위치.

```text
ecommerce/
├── app/                      # Framework/Routing 계층
│   └── (main)/
│       └── products/
│           └── page.tsx      # Use Case 호출 후 Presentation 컴포넌트로 데이터 전달
└── src/                      
    ├── core/                 # 공통 핵심 모듈 (도메인 비종속)
    │   ├── api/
    │   ├── components/
    │   ├── config/
    │   └── utils/
    └── features/             # 도메인(기능) 단위 패키지 (Feature-First)
        └── products/
            ├── domain/       # [Domain Layer]
            ├── application/  # [Application Layer]
            ├── infrastructure/# [Infrastructure Layer]
            └── presentation/ # [Presentation Layer]
```

## 🧱 계층별(Layer) 역할 가이드라인

모든 코드는 아래 4개의 계층 중 하나에 속해야 하며, **의존성은 항상 바깥쪽(외부)에서 안쪽(도메인)을 향해야 합니다.** `Domain`은 그 어떤 것도 의존해서는 안 됩니다.

### 1. Domain Layer (`domain/`)
*   **역할:** 비즈니스 엔티티, 도메인 규칙, 도메인 에러를 정의합니다.
*   **제한:** React, Next.js, 외부 라이브러리(axios 등)에 대한 의존성을 가지면 안 됩니다. 순수 TypeScript/JavaScript로만 작성.
*   **예시:** `Product.ts` (타입/클래스), `ProductError.ts`.

### 2. Application Layer (`application/`)
*   **역할:** 도메인 규칙을 활용해 실제 사용자의 요청(Use Case)을 처리합니다. 상태 관리가 포함될 수 있습니다.
*   **구현:** Custom Hooks(`useProductList.ts`), Service 인터페이스, 상태 관리 액션.
*   **제한:** 직접 외부 통신(API 등)을 세부 구현하지 않고 인프라 계층에 위임하거나 인터페이스에 의존합니다. UI 로직을 가지면 안 됩니다.

### 3. Infrastructure Layer (`infrastructure/`)
*   **역할:** 외부 시스템(백엔드 서버 API, LocalStorage, 서드파티 SDK)과의 통신을 담당합니다.
*   **구현:** Repository 패턴 구현체, API DTO 타입, DTO를 Domain Entity로 변환하는 Mapper 함수.
*   **규칙:** 서버 데이터 형식(DTO)이 변경되어도 Mapper가 이를 방어해 Domain과 UI 계층의 수정을 막아야 합니다.

### 4. Presentation Layer (`presentation/` 및 `app/`)
*   **역할:** 화면에 UI를 렌더링하고, 사용자 이벤트를 Application 계층에 전달합니다.
*   **위치:** 
    *   도메인 종속 UI: `src/features/[domain]/presentation/components/...`
    *   페이지 라우팅: `app/.../page.tsx`
*   **제한:** 복잡한 비즈니스 로직이나 데이터 가공을 직접 수행하지 않습니다. UI 상태만 관리합니다.

## ⚠️ 코딩 시 주의사항 및 금지 패턴

1.  **도메인 계층 오염 금지:** `domain` 내의 파일이 `react`나 외부 SDK를 import하고 있다면 구조가 잘못된 것입니다.
2.  **App 계층에서 직접 API 호출 금지:** `app/page.tsx` 내부에서 직접 fetch를 사용하더라도, 비즈니스 규칙과 매핑 로직 등의 세부는 인프라 레이어나 어플리케이션 레이어로 추상화하여 호출합니다.
3.  **UI 컴포넌트의 거대화 방지:** 컴포넌트가 너무 많은 일(상태 관리, 데이터 변환, 예외 처리)을 하지 않도록 주의하고, 비즈니스 로직은 Custom Hook(Application Layer)으로 분리하세요.
