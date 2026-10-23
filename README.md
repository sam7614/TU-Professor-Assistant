# TU 교수자용 학습설계 어시스턴트

교수자·교육과정 관리자를 위한 모듈 이수 현황 및 상담 지원 대시보드입니다. ZIP 안에 있던 교수자용 프로젝트를 일반 소스로 복원하여 이 저장소의 루트에서 실행·빌드합니다.

## 빠른 시작

Node.js 22.12 이상 또는 24.x와 npm을 사용합니다.

```sh
npm ci
npm run dev
```

개발 주소: http://127.0.0.1:3000

```sh
npm run typecheck
npm run build
npm run preview
```

빌드 결과는 `dist/`에 생성됩니다. 프리뷰 주소는 실행 시 터미널에 표시됩니다. 현재 화면은 모의 데이터 기반 프로토타입이며 API 키 없이 실행됩니다.

## 프로젝트 구조

```text
src/
  main.tsx                 앱 진입점
  App.tsx                  교수자 화면·탐색
  constants.ts             모의 학생·차트·상담 데이터
  types.ts                 데이터 타입
  styles.css               Tailwind와 공통 스타일
  components/              대시보드·학생·상담·네트워크·통계 화면
legacy/student-app/        종전 학생용·Streamlit 소스 (보존용)
docs/                      소스 출처와 이관 기록
index.html                 교수자용 HTML 진입점
vite.config.ts             실행·빌드 설정
vercel.json                Vercel 빌드 설정
```

`legacy/student-app/`는 원래 저장소 최상위에 있던 파일을 그대로 보존한 공간입니다. 필요한 views 폴더 등이 원본 커밋에 없으므로 해당 학생용 코드가 완전한 실행본이라는 의미는 아닙니다. 교수자용 빌드·타입 검사·배포에는 포함하지 않습니다.

## Vercel 배포

이 저장소의 `main`을 연결하고 다음 설정을 사용합니다.

- Framework: Vite
- Root Directory: 저장소 루트 (비워 둠)
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`

위 빌드 명령은 `vercel.json`에도 명시했습니다. 프로젝트 설정이 다른 폴더를 가리키거나 도메인이 다른 저장소에 연결되어 있으면 별도로 수정해야 합니다. ZIP을 업로드하거나 수동으로 풀 필요가 없습니다.

기존 운영 프로젝트는 `sam7614s-projects/micro-degree-student`이며, 이관 전에는 `sam7614/micro-degree-student` 저장소에 연결되어 있었습니다. 정리된 교수자용 소스의 빌드 검증 후 이 프로젝트의 Git 연결을 본 저장소에 맞춥니다. 진행 결과는 `docs/MIGRATION.md`에 기록합니다.

## 환경 설정

현재 교수자용 프로토타입에는 외부 AI 호출·백엔드·API 키가 필요하지 않습니다. 빌드 설정에서 비밀값을 클라이언트 코드에 주입하지 않습니다. `.env*`, `.local/`, `.vercel/` 및 로컬 인증 파일은 추적·배포에서 제외합니다.

기존 루트 환경 파일과 원본 ZIP은 이관 작업을 수행한 로컬 폴더의 `.local/`에 보관했으며 새 Git 트리에는 포함하지 않습니다. 원본 ZIP과 학생용 소스의 출처는 이전 커밋과 `docs/source-provenance.json`으로 추적합니다. 기존 Git 이력은 다시 쓰지 않았습니다.

## 현재 기능 범위

복원 범위는 원본 교수자용 화면과 빌드 환경입니다. 모의 데이터·고정 요약 수치·미연결 버튼은 원본에 있던 기능 상태이며 이번 구조 정리에서 실제 학사 연동·상담 영속 저장·AI 모델 기능으로 전환하지 않았습니다.

후속 작업은 고정 평가 데이터와 집계 기준 정리, 상담 저장·조회, 학생의 자기설계·성찰, 교수자의 제안 검토 이력 연결 순서로 진행합니다. 연구 기록은 별도 [Project_B 저장소](https://github.com/sam7614/Project_B)에서 관리합니다.
