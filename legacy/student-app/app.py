import streamlit as st
import google.generativeai as genai
import os
from datetime import datetime
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv('.env.local')
load_dotenv()

# 페이지 설정
st.set_page_config(
    page_title="TU 학습설계 AI 어시스턴트",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# API 키 로드 (우선순위: Streamlit secrets > 환경 변수)
API_KEY = ""
if hasattr(st, 'secrets') and 'GEMINI_API_KEY' in st.secrets:
    API_KEY = st.secrets['GEMINI_API_KEY']
else:
    API_KEY = os.getenv("GEMINI_API_KEY", "")

# Gemini AI 설정
if API_KEY and API_KEY != "PLACEHOLDER_API_KEY":
    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
    except Exception as e:
        st.error(f"Gemini API 설정 오류: {str(e)}")
        model = None
else:
    model = None

# 세션 상태 초기화
if 'current_view' not in st.session_state:
    st.session_state.current_view = '대시보드'
if 'user_profile' not in st.session_state:
    st.session_state.user_profile = {
        'major': '유아교육과',
        'interests': '',
        'aptitude': ''
    }

# 사이드바 네비게이션
with st.sidebar:
    st.title("🎓 TU 학습설계 AI")
    st.divider()
    
    menu_items = [
        "대시보드",
        "학습 이력",
        "모듈 탐색",
        "모듈 카트",
        "나의 모듈 설계",
        "AI 추천"
    ]
    
    for item in menu_items:
        if st.button(item, key=item, use_container_width=True):
            st.session_state.current_view = item
    
    st.divider()
    st.caption("커뮤니티")

# 메인 컨텐츠
st.title(f"안녕하세요, 한상준님! 👋")
st.caption("오늘도 나만의 학습 여정을 차곡차곡 쌓아보세요.")

# 현재 뷰에 따라 다른 컨텐츠 표시
if st.session_state.current_view == '대시보드':
    # 모듈 이수 현황
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("📊 모듈 이수 현황")
        
        # 이수 중인 모듈
        with st.expander("이수 중인 모듈 (3개)", expanded=True):
            st.markdown("**빅데이터 경영 MD**")
            st.markdown("🔵 데이터분석 (이수) | 🟢 데이터시각화 (수강중) | ⚪ 비즈니스 (미이수)")
            
            st.markdown("**AI-SW MD**")
            st.markdown("🔵 프로그래밍 (이수) | 🟢 컴퓨팅 (수강중) | ⚪ 기초 (미이수)")
            
            st.markdown("**디지털마케팅 MD**")
            st.markdown("🔵 마케팅 (이수) | 🔵 디지털 (이수) | 🟢 전략 (수강중)")
        
        # 완료한 모듈
        with st.expander("완료한 모듈 (3개)"):
            st.markdown("- **AI-SW MD** (컴퓨터공학과 / 2024-2 이수)")
            st.markdown("- **프로그래밍 기초** (컴퓨터공학과 / 2024-1 이수)")
            st.markdown("- **데이터분석 입문** (경영학과 / 2024-2 이수)")
        
        # 추천 모듈
        with st.expander("추천 모듈 (3개)"):
            st.markdown("**🎯 AI 컨설팅 융합**")
            st.caption("AI 기술을 비즈니스 문제 해결에 적용하는 컨설팅 역량 강화")
            
            st.markdown("**🎯 데이터 기반 마케팅**")
            st.caption("데이터 분석 기술을 디지털 마케팅 전략 수립에 활용")
            
            st.markdown("**🎯 스마트팩토리 운영**")
            st.caption("AI와 IoT 기술을 제조업 공정 관리에 적용")
    
    with col2:
        st.metric("총 이수 학점", "102 / 120", "85%")
        st.progress(0.85)
    
    st.divider()
    
    # 나의 이수학점
    st.subheader("📚 나의 이수학점")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("전공 이수 학점", "57학점")
    with col2:
        st.metric("교양 이수 학점", "33학점")
    with col3:
        st.metric("기타 이수 학점", "12학점")

elif st.session_state.current_view == 'AI 추천':
    st.subheader("🤖 AI 맞춤 추천")
    
    # API 키 상태 표시
    if not model:
        st.warning("⚠️ Gemini API 키가 설정되지 않았습니다. AI 추천 기능을 사용하려면 API 키를 설정해주세요.")
        
        with st.expander("📝 API 키 설정 방법"):
            st.markdown("""
            **방법 1: .env 파일 사용 (로컬 개발)**
            1. 프로젝트 폴더에 `.env` 파일 생성
            2. 다음 내용 추가:
            ```
            GEMINI_API_KEY=your_actual_api_key_here
            ```
            
            **방법 2: Streamlit Cloud 배포**
            1. Streamlit Cloud 대시보드에서 앱 설정 열기
            2. Secrets 섹션에 다음 추가:
            ```
            GEMINI_API_KEY = "your_actual_api_key_here"
            ```
            
            **API 키 발급:**
            - https://aistudio.google.com/app/apikey 에서 무료로 발급받을 수 있습니다.
            """)
    
    st.markdown("### 프로필 입력")
    
    col1, col2 = st.columns(2)
    with col1:
        major = st.text_input("전공", value=st.session_state.user_profile['major'])
        interests = st.text_area("관심 분야", value=st.session_state.user_profile['interests'], 
                                 placeholder="예: AI, 데이터 분석, 비즈니스, 교육 기술")
    
    with col2:
        aptitude = st.text_area("적성 및 진로 목표", value=st.session_state.user_profile['aptitude'],
                               placeholder="예: 데이터 사이언티스트, 창업, 교육 전문가")
    
    if st.button("🎯 AI 추천 받기", type="primary", disabled=not model):
        if not interests or not aptitude:
            st.warning("관심 분야와 적성을 입력해주세요.")
        else:
            st.session_state.user_profile.update({
                'major': major,
                'interests': interests,
                'aptitude': aptitude
            })
            
            with st.spinner("AI가 맞춤 추천을 생성하고 있습니다..."):
                try:
                    prompt = f"""
                    당신은 대학교 학습 설계 전문 상담사입니다.
                    
                    학생 프로필:
                    - 현재 전공: {major}
                    - 관심 분야: {interests}
                    - 적성/진로 목표: {aptitude}
                    
                    이 학생에게 적합한 학습 경로를 추천해주세요:
                    
                    1. **마이크로 디그리 (MD) 2개 추천**
                       - 각 MD는 9-15학점 규모의 소규모 융합 모듈입니다
                       - 제목, 구성 학과, 추천 이유를 포함해주세요
                    
                    2. **복수전공 1개 추천 (약 36학점)**
                       - 어떤 모듈들을 조합하면 좋을지 설명해주세요
                       - 제목, 구성, 추천 이유를 포함해주세요
                    
                    3. **부전공 1개 추천 (약 24학점)**
                       - 전공을 보완할 수 있는 부전공을 추천해주세요
                       - 제목, 구성, 추천 이유를 포함해주세요
                    
                    각 추천은 학생의 관심사와 진로 목표에 맞춰 구체적이고 실용적으로 작성해주세요.
                    마크다운 형식으로 보기 좋게 정리해주세요.
                    """
                    
                    response = model.generate_content(prompt)
                    
                    st.success("✅ AI 추천이 완료되었습니다!")
                    st.divider()
                    st.markdown("### 📋 맞춤형 학습 경로 추천")
                    st.markdown(response.text)
                    
                    # 추천 결과 저장
                    if 'recommendations' not in st.session_state:
                        st.session_state.recommendations = []
                    st.session_state.recommendations.append({
                        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M'),
                        'profile': st.session_state.user_profile.copy(),
                        'result': response.text
                    })
                    
                except Exception as e:
                    st.error(f"❌ 오류가 발생했습니다: {str(e)}")
                    st.info("API 키가 올바른지 확인해주세요.")

elif st.session_state.current_view == '모듈 탐색':
    st.subheader("🔍 모듈 탐색")
    
    search = st.text_input("🔎 모듈명, 교과목명 검색...")
    
    col1, col2, col3 = st.columns(3)
    
    modules = [
        {"name": "AI 융합 비즈니스 MD", "dept": "경영학과 + 컴퓨터공학과", "credits": 12},
        {"name": "빅데이터 분석 기초 MD", "dept": "산업공학과", "credits": 9},
        {"name": "디지털 마케팅 MD", "dept": "경영학과", "credits": 15},
        {"name": "스마트팩토리 운영 MD", "dept": "기계공학과 + 산업공학과", "credits": 12},
        {"name": "웹 풀스택 개발 MD", "dept": "컴퓨터공학과", "credits": 15},
        {"name": "UX/UI 디자인 MD", "dept": "디자인학과", "credits": 9},
    ]
    
    for idx, module in enumerate(modules):
        with [col1, col2, col3][idx % 3]:
            with st.container():
                st.markdown(f"**{module['name']}**")
                st.caption(f"📚 {module['dept']}")
                st.caption(f"🎓 {module['credits']}학점")
                if st.button("상세보기", key=f"module_{idx}"):
                    st.info(f"{module['name']}의 상세 정보")

elif st.session_state.current_view == '학습 이력':
    st.subheader("📖 학습 이력")
    
    st.markdown("### 2024년 2학기")
    st.markdown("- 데이터시각화 (수강중)")
    st.markdown("- 컴퓨팅사고 (수강중)")
    st.markdown("- 디지털마케팅전략 (수강중)")
    
    st.markdown("### 2024년 1학기")
    st.markdown("- 데이터분석입문 (A+)")
    st.markdown("- 프로그래밍기초 (A)")
    st.markdown("- 경영정보시스템 (B+)")

elif st.session_state.current_view == '모듈 카트':
    st.subheader("🛒 모듈 카트")
    st.info("관심 있는 모듈을 담아두고 학습 계획을 세워보세요.")
    
    if st.button("➕ 모듈 추가하기"):
        st.success("모듈이 카트에 추가되었습니다!")

elif st.session_state.current_view == '나의 모듈 설계':
    st.subheader("✏️ 나의 모듈 설계")
    
    st.markdown("### 새로운 융합 모듈 만들기")
    
    module_name = st.text_input("모듈 이름")
    module_desc = st.text_area("모듈 설명")
    
    st.markdown("### 교과목 선택")
    subjects = st.multiselect(
        "포함할 교과목을 선택하세요",
        ["데이터분석", "프로그래밍", "마케팅", "경영전략", "AI기초", "웹개발"]
    )
    
    if st.button("💾 모듈 저장"):
        if module_name and subjects:
            st.success(f"'{module_name}' 모듈이 저장되었습니다!")
        else:
            st.warning("모듈 이름과 교과목을 입력해주세요.")

# 푸터
st.divider()
st.caption(f"© 2024 TU 학습설계 AI 어시스턴트 | 마지막 업데이트: {datetime.now().strftime('%Y-%m-%d')}")
