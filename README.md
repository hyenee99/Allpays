## 📑올페이즈
결제/가맹점 관련 데이터를 시각화하는 대시보드 화면 페이지 구현

<br />

### 🪄 실행 방법

#### .env 파일 추가
```
VITE_API_BASE_URL=https://recruit.paysbypays.com/api/v1
```
#### 의존성 설치
```
npm install 
```
#### 개발 서버 실행
```
npm run dev
```
<br />

### ✅ 기능 소개

#### 메인 페이지
<img width="1918" height="900" alt="image" src="https://github.com/user-attachments/assets/38544c3b-7ab1-4927-bd86-e73b63164cb6" />
- 본 프로젝트에서는 월별 매출, 일별 통계 등을 2025년 11월을 기준으로 고정하여 구현했습니다.
  <br/>
- 메인 화면에서는 이번 달의 거래 요약을 제공하며, 총 매출과 결제 상태를 그래프 형태로 한눈에 확인할 수 있습니다.

#### 거래 내역 조회 페이지
<img width="1900" height="595" alt="image" src="https://github.com/user-attachments/assets/0d456c48-a4bc-44c8-ac8d-1806ef4cc974" />
<img width="1897" height="811" alt="image" src="https://github.com/user-attachments/assets/202f067b-0814-4d3c-99db-e73468bc72b2" />
- 결제 수단별, 통화별 통계를 바 그래프와 원 그래프로 시각화하여 제공합니다.
  <br/>
- 전체 거래 내역을 테이블 형태로 조회할 수 있으며, 결제 상태 필터와 검색 기능을 지원합니다.
  <br/>
- 테이블 행 클릭시 해당 가맹점 상세 페이지로 이동합니다.
  <br/>
- Pagination 기능을 적용하여 많은 데이터도 효율적으로 확인할 수 있습니다.
  <br/>

#### 가맹점 관리 페이지
<img width="1917" height="902" alt="image" src="https://github.com/user-attachments/assets/4ac647c8-8cb7-41ce-9b1b-6977c3de8ef2" />
- 가맹점 목록을 테이블로 제공하며, 상태 필터, 검색, 매출 기준 정렬 기능을 통해 원하는 가맹점을 빠르게 조회할 수 있습니다. 
  <br/>
- 각 행을 클릭하면 해당 가맹점의 상세 정보를 확인할 수 있습니다. 
  <br/>
- Pagination 적용으로 많은 데이터도 부담 없이 탐색할 수 있습니다. 
  <br/>

#### 가맹점 상세 조회 페이지
<img width="1912" height="897" alt="image" src="https://github.com/user-attachments/assets/75686fc6-4df0-4695-a930-ce3a2b291075" />
- 거래 내역 또는 가맹점 목록 테이블의 행을 클릭하면 해당 가맹점의 상세 페이지로 이동할 수 있습니다.
  <br/>
- 상세 페이지에서는 해당 가맹점의 주요 정보를 확인할 수 있습니다.

<br />


### 🎨 디자인 의도 및 주요 UI/UX 포인트
- 결제대행사 서비스 특성상 **신뢰감과 안정성**을 전달하기 위해 **남색 기반의 톤**으로 전체 디자인을 구성했습니다.
- 핵심 데이터(매출, 결제 상태)를 첫 화면에서 **직관적으로 확인**할 수 있도록 정보 구조를 설계했습니다.
- 차트와 테이블 등 주요 구성 요소는 **한눈에 읽히는 단순하고 명확한 UX**를 목표로 디자인했습니다. 

---

### ⚒️ 개발 환경
- **Package Manager**: npm
- **Build Tool**: Vite
  
### 🛠️ 기술 스택
- **Frontend** : React, TypeScript
- **Style**: Tailwind CSS
- **Chart** : Recharts
- **HTTP Client:** Axios

### 📝 기술 스택 선정 이유
- **React** : 컴포넌트 기반 구조로 대시보드처럼 화면 구성이 복잡한 프로젝트를 체계적으로 관리하기 좋기 때문에 선택했습니다.
- **TypeScript** : API 응답 타입을 명확하게 정의할 수 있어 런타임 오류를 줄일 수 있기 때문에 선택했습니다.
- **Tailwind CSS** : 별도의 CSS 파일 관리 없이 클래스 기반으로 빠르게 스타일링 할 수 있어 선택했습니다.
- **Recharts** : React 기반의 차트 라이브러리로, 다양한 시각화 기능을 제공하고 TypeScript 와 호환성이 좋아 선택했습니다.
- **Axios** : HTTP 요청을 쉽고 간편하게 처리할 수 있어 선택했습니다.
