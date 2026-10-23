# 교수자용 소스 구조 이관 기록

- 작업일: 2026-10-23
- 원본 커밋: 74d467fb393906dbdc6ee76d898fada810dbb60a
- 원본 파일: 해당 커밋의 tu-professor-assistant.zip
- 원본 ZIP SHA-256: d991e48de88e5e97e75b2ff152d23db4c79a2892404156ab1f12ce449822e775
- 추출 시 파일별 SHA-256: source-provenance.json

## 처리 내용

1. 기존 학생용·Streamlit 소스와 설정은 legacy/student-app으로 이동해 보존했다.
2. ZIP의 교수자용 App·상수·타입·컴포넌트를 src로 복원하고 진입점을 src/main.tsx로 정리했다.
3. 누락되어 있던 교수자용 라이브러리와 타입 정의를 package.json에 선언하고 lockfile을 새로 생성한다.
4. Tailwind 런타임 CDN과 import map 대신 Vite·PostCSS 기반 로컬 빌드를 사용한다.
5. 타입 검사와 프로덕션 빌드, Vercel 루트 빌드 설정과 사용 안내를 추가했다.
6. 기존 환경 파일과 원본 ZIP은 로컬 .local에 보관하고 현재 Git 트리에서 제외했다. 값은 출력하거나 이관 문서에 복사하지 않았다. 이전 Git 이력은 보존한다.

## 검증 기록

- `npm ci --ignore-scripts --no-audit`: lockfile 기반 재설치 성공 (225 packages).
- `npm run build`: 엄격한 TypeScript 검사와 Vite 프로덕션 빌드 성공.
- 원본의 D3 노드·이벤트 대상 타입 및 잘못된 소문자 Recharts cell 컴포넌트를 수정했다.
- 빌드 산출물의 대시보드·학생 상세·모듈 필터·개별 상담·D3 네트워크·모듈 통계·취업 사례 모달을 격리된 브라우저에서 확인했다.
- 모바일 메뉴 이동과 폭 390px에서 가로 넘침이 없음을 확인했다.
- 검증한 동선에 JavaScript 예외와 로컬 산출물 404가 없었다. 외부 Tailwind CDN 없이 컴파일한 CSS가 적용되었다.
- 화면의 데이터·수치·일부 미연결 동작은 원본 프로토타입 상태다. 상담 영속 저장이나 실제 AI 모델의 완성도 검증을 수행한 것은 아니다.
- 원본의 중첩 D3 컴포넌트와 일부 any 타입 등은 후속 개선 대상으로 남겼다. 모듈별 참조 경로·효과 정리·기존 동작 유지·타입 호환성을 검토했다.
- 현재 단일 JS 번들이 약 801 kB로 빌드되어 Vite의 크기 경고가 있다. 빌드 실패는 아니며 페이지별 코드 분리는 후속 성능 개선 과제다.

## 배포 경계

이 저장소의 배포 설정과 교수자용 코드가 일치하도록 정리한다. Vercel 계정·프로젝트·커밋·환경을 확인한 뒤 배포하며, 기존 micro-degree-student 도메인은 연결 관계 확인 없이 재할당하지 않는다.


## 기존 운영 프로젝트 확인

2026-10-23 Vercel CLI 로그인으로 운영 주소를 확인했다.

- 프로젝트: sam7614s-projects/micro-degree-student
- 프로젝트 ID: prj_xPWOCmyJFvf7vaJtZrDgkiZWYfDB
- 운영 주소: https://micro-degree-student.vercel.app/
- 작업 전 연결 저장소: sam7614/micro-degree-student (main)
- 작업 전 운영 배포 ID: dpl_4H3ez1DQHC1S42xticuDRCHpf3Tg
- 교수자용 소스를 정리한 저장소: sam7614/TU-Professor-Assistant

운영 주소와 코드 저장소의 연결이 달랐음을 확인했다. 빌드 검증 후 같은 Vercel 프로젝트를 정리된 교수자용 저장소에 연결해 반복 개발·배포 경로를 일치시키는 것을 이관 범위로 한다.
