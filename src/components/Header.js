import React, { useState } from 'react';
import styled from 'styled-components';
import MoreInfoModal from '../components/modals/MoreInfoModal';
import MyInfoModal from '../components/modals/MyInfoModal';
import ManualModal from '../components/modals/ManualModal';
import Logo from '../Images/Logo.svg';
import Icon_Menu from '../Images/Icon_Menu.png';
import manualBtn from '../Images/manualBtn.png';
import CardIcon_person from '../Images/CardIcon_person.png';
import { history } from '../redux/configureStore';

const Header = (props) => {
  const isLocal = localStorage.getItem('isLogin') ? true : false;

  const [showModal, setShowModal] = React.useState(false);
  const [myModal, setMyModal] = React.useState(false);
  const [guideModal, setGuideModal] = React.useState(false);
  const [bubble, setBubble] = React.useState(true);

  const openModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setMyModal(false);
      setGuideModal(false);
      // setBubble(false);
    }
  };

  const openMyInfoModal = () => {
    setMyModal(!myModal);
    if (!myModal) {
      setShowModal(false);
      setGuideModal(false);
    }
  };

  const openManual = () => {
    setGuideModal(!guideModal);
    if (!guideModal) {
      setShowModal(false);
      setMyModal(false);
      setBubble(false);
    }
  };

  return (
    <HeaderContainer>
      <HeaderGrid>
        <img
          src={Logo}
          alt="홈트게더 로고"
          style={{ width: '130px', height: '32px' }}
          onClick={() => {
            history.push('/');
          }}
        />

        <IconsWrap style={{ width: isLocal ? '' : '113px' }}>
          <Icons onClick={openModal}>
            <img src={Icon_Menu} alt="메뉴 버튼" style={{ width: '24px' }} />
            {showModal && <MoreInfoModal openModal={openModal} />}
          </Icons>
          {isLocal ? (
            <Icons>
              <img src={CardIcon_person} alt="회원정보 버튼" onClick={openMyInfoModal} style={{ width: '24px' }} />
              {myModal && <MyInfoModal openMyInfoModal={openMyInfoModal} />}
            </Icons>
          ) : null}

          <Icons>
            <img src={manualBtn} alt="서비스 메뉴얼 버튼" style={{ width: '20px' }} onClick={openManual} />
            {!isLocal
              ? bubble && (
                  <BubbleWrap>
                    홈트게더가 처음이신가요? <br />
                    사용 방법을 확인해 보세요
                  </BubbleWrap>
                )
              : null}
            {guideModal && <ManualModal openManual={openManual} />}
          </Icons>
        </IconsWrap>
      </HeaderGrid>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  width: 100vw;
  height: 64px;
  background: #f8f9fa;
  border-bottom: 1px solid #eaecef;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const IconsWrap = styled.div`
  width: 180px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
`;

const Icons = styled.div`
  cursor: pointer;
  position: relative;
  width: 24px;
  display: flex;
  justify-content: center;
`;

const HeaderGrid = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 1320px;
  & > p {
    color: #4a5056;
    font-size: 20px;
    font-weight: bold;
  }
  @media screen and (max-width: 1360px) {
    width: 990px;
  }
`;

const BubbleWrap = styled.div`
  z-index: 50;
  width: 192px;
  height: 100px;
  color: #f8f9fa;
  background-color: #0028fa;
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 4;
  right: -0.6rem;
  top: 2.4rem;
  :after {
    border-top: 0px solid transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #0028fa;
    content: '';
    position: absolute;
    top: -8px;
    right: 12px;
  }
`;
export default Header;
