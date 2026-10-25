# 합성 데이터 데모

2026-10-25: 실행마다 바뀌던 학생 데이터를 고정 시드 20261025의 합성 fixture로 교체했다. 실제 학생 입력은 0건이다.

- 연구 저장소: https://github.com/sam7614/Project_B
- 생성기: scripts/generate-synthetic-students.cjs
- 검증기: scripts/verify-synthetic-students.cjs
- 전체 20,000건은 연구 저장소 로컬 .synthetic-data에 생성하며 앱 번들에는 포함하지 않는다.
- 앱은 4학년 × 4모듈 × 16시나리오 = 256건만 src/data/synthetic-students.json으로 포함한다.
- 가상학생 명칭, SYN 식별자, example.invalid 이메일과 비전화 문자열을 사용한다.
- 앱용 변환: 첫 256건의 peerGroup을 (i+16)%256 위치의 가상학생 1명으로 설정한다. 고정 관계는 예시이며 실제 교우관계나 소외 지표가 아니다.
- 학생 카드와 표의 대상은 동일 256건이며 대시보드 집계는 이수율/상태에서 계산한다. 학기 비교 수치는 제거했다.
- 상담 내역·성찰 등 추가 합성 필드는 향후 저장·상담 흐름 구현용이며 기존 공통 메시지 UI와 아직 연결하지 않았다.
- 네트워크의 입력 노드·링크는 고정된다. D3 배치 애니메이션 좌표는 렌더링 상태이므로 연구 측정값으로 사용하지 않는다.
- 기존 모듈 추세·역량·취업 예시와 미연결 UI는 남아 있다. 전역 배너에 합성 데모임을 표시한다.

## 허용되는 해석

재현 가능한 UI 검증, 시나리오 walkthrough, 로컬 기술 처리량 측정과 분석 코드 실행 점검에 사용한다. 실제 요구도·만족도·학생 위험률·교육 효과·추천 정확도·심리 특성이나 실증 표본 수로 해석하지 않는다. 생성 규칙과 같은 규칙의 정답 일치는 교육적 타당성이 아니다.

## 재현

연구 저장소에서 node scripts/generate-synthetic-students.cjs 및 node scripts/verify-synthetic-students.cjs 실행 후 demo-students.json의 위 peerGroup 변환을 적용한다. docs/synthetic-data-manifest.json에서 시드·생성기 해시·전체 파일 해시와 앱 변환본 해시를 확인한다. 학년·모듈·상황의 균형은 연구자 설계이며 실제 모집단의 분포가 아니다.
