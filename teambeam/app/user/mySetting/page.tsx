import React from "react";

const PrivateSetting = () => {
  return (
    <div>
      <div>
        <div>
          <p>회원 정보</p>
          <image />
        </div>
        <div>
          <span>이름</span>
          <input placeholder="홍길동"/>
          <p>정보 수정</p>
          <hr />
          <form>
            <div>
              <span>메일 주소</span>
              <span>asdf12344@asdf.com</span>
              <input />
              <button>코드 발급</button>
              <input />
              <button>코드 확인</button>
            </div>
          </form>
          <form>
            <div>
              <input placeholder="현재 비밀번호를 입력해주세요." />
              <input />
              <p>영문/숫자/기호(!,@,?,#,&,*,^)를 모두 포함하는 8자리 이상의 비밀번호를 입력해주세요.</p>
              <input />
              <p>오류 로그</p>
            </div>
            <button>변경한 비밀번호 저장하기</button>
          </form>
        </div>
      </div>
      <div>
        <p>화면 설정</p>
        <form>
          <div>
            <div>
              <span>메인 페이지 설정</span>
              <input type="radio" name="page"/>
              <label>프로젝트 메인 (기본)</label>
              <input type="radio" name="page"/>
              <label>개인 화면 보기</label>
            </div>
            <div>
              <span>화면 보기 설정</span>
              <input type="radio" name="screenMode"/>
              <label>라이트 모드 (기본)</label>
              <input type="radio" name="screenMode"/>
              <label>다크 모드</label>
            </div>
          </div>
        </form>
      </div>
      <button>회원탈퇴</button>
    </div>
  );
};

export default PrivateSetting;