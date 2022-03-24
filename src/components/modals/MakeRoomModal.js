import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import close from "../../Images/MakeRoomModalIcon_close.png";
import greyEye from "../../Images/MakeRoomModalIcon_greyEye.png";
import blackEye from "../../Images/MakeRoomModalIcon_blackEye.png";
import checkBox from "../../Images/MakeRoomModalIcon_checkBox.png";
import noneCheckBox from "../../Images/MakeRoomModalIcon_noneCheckBox.png";
import Dropdown from "../Dropdown";
import { _parserVideoId, _getVideoInfo } from "../YoutubeDataAPI";
import { actionCreators as roomActions } from "../../redux/modules/room";

const MakeRoomModal = (props) => {
  const dispatch = useDispatch();

  // 모달창
  const { setIsMakeModal } = props;
  const modal = React.useRef();
  // 셀렉트탭
  const [clickedDifficulty, setClickedDifficulty] = React.useState();
  const difficultyList = ["초급", "중급", "고급"];
  const [clickedStartTime, setClickedStartTime] = React.useState();
  const startTimeList = ["1분 뒤", "15분 뒤", "30분 뒤"];
  // 태그선택
  const $RoomNameInput = React.useRef();
  const $LinkInput = React.useRef();

  const [clickedCategory, setClickedCategory] = React.useState();

  // textarea 입력된 글자수체크
  const [inputTextarea, setTextarea] = React.useState("");
  const onChange = (e) => {
    setTextarea(e.target.value);
  };

  // 비밀방여부
  const [isSecret, setIsSecret] = React.useState(false);
  const $pwInput = React.useRef();
  const $postMessage = React.useRef();
  const [pwInputWrong, setPwInputWrong] = React.useState(false);
  const checkSecret = (e) => {
    setIsSecret(!isSecret);
    if (isSecret) {
      $pwInput.current.style.visibility = "hidden";
      $pwInput.current.value = "";
      $postMessage.current.style.visibility = "hidden";
    } else {
      $pwInput.current.style.visibility = "visible";
      $postMessage.current.style.visibility = "visible";
    }
  };
  const pwOnkeydown = (e) => {
    let code = e.keyCode;
    if (
      (code > 47 && code < 58) ||
      (code > 95 && code < 106) ||
      e.keyCode === 8
    ) {
      setPwInputWrong(false);
      return;
    }
    setPwInputWrong(true);
    e.preventDefault();
  };
  // 카테고리값받아오기_ 자식 컴포넌트에서 부모컴포넌트로 값 전달방법 props에 함수 넘겨줌
  const categoryList = [
    "근력 운동",
    "유산소 운동",
    "스트레칭",
    "요가/필라테스",
    "기타",
  ];
  const getCategory = (category) => {
    setClickedCategory(category);
  };

  const clickMakeBtn = () => {
    // 미입력시 알림창띄우기 => 나중에 이쁜 모달이나 글자가 흔들리는걸로 변경하기
    const checkInputArray = [
      $RoomNameInput.current.value,
      difficultyList[clickedDifficulty],
      categoryList[clickedCategory],
      $LinkInput.current.value,
      startTimeList[clickedStartTime],
    ];

    let alert = [
      "방제목을 입력해주세요",
      "운동 난이도를 선택해주세요",
      "카테고리를 선택해주세요",
      "링크를 입력해주세요",
      "시작 시간을 설정해주세요",
    ];
    for (let i = 0; i < checkInputArray.length; i++) {
      if (!checkInputArray[i]) {
        window.alert(alert[i]);
        return;
      }
    }
    if (
      isSecret &&
      ($pwInput.current.value === "" ||
        $pwInput.current.value.length < 4 ||
        $pwInput.current.value.length > 8)
    ) {
      window.alert("비밀번호는 숫자 4~8자 사이로 입력해주세요");
      return;
    }

    let videoId = _parserVideoId($LinkInput.current.value);
    if (!videoId) {
      // 유튜브 링크 형식이 아닌 것을 올렸을 때 리턴처리
      window.alert("유튜브 링크가 올바른지 확인해주세요");
      return;
    }
    //youtubeDataApi를 이용하여 입력받은 링크를 가지고 비디오데이터를 받아온뒤 서버 api에 보낼 데이터로 정제 후 보내기
    _getVideoInfo(videoId)
      .then((v) => {
        const roomInfo = {
          roomTitle: $RoomNameInput.current.value,
          videoThumbnail: v.thumbnail,
          videoLength: v.duration,
          videoUrl: $LinkInput.current.value,
          videoTitle: v.title,
          videoStartAfter: +startTimeList[clickedStartTime].split("분")[0],
          category: categoryList[clickedCategory],
          difficulty: difficultyList[clickedDifficulty],
          password: isSecret ? $pwInput.current.value : "",
        };
        dispatch(roomActions.addRoomDB(roomInfo));
      })
      .catch((err) => {
        // 유튜브 링크 형식이지만 정보가 없는 것을 리턴처리
        window.alert("현재 해당 영상의 정보를 받아올 수 없어요");
        return;
      });
  };

  return (
    <Background
      onClick={() => {
        // setIsMakeModal(false);
        // document.body.style.overflow = "unset";
      }}
    >
      <MakeRoomContainer
        ref={modal}
        // onClick={(e) => e.stopPropagation()}
      >
        <MakeRoomHeader className="boldText">
          방 만들기
          <img
            src={close}
            alt="엑스 아이콘"
            onClick={() => {
              setIsMakeModal(false);
              // document.body.style.overflow = "unset";
            }}
            style={{ cursor: "pointer" }}
          />
        </MakeRoomHeader>
        <MakeRoomNameBox>
          <Label style={{ margin: "42px 0px 14px 0px" }}>
            <p className="boldText">방 이름</p>
            <p style={{ fontSize: "16px" }}>{inputTextarea.length} / 50자</p>
          </Label>
          <RoomNameInput
            maxLength={49}
            type="text"
            placeholder="생성할 방의 이름을 입력해주세요"
            ref={$RoomNameInput}
            onChange={onChange}
          />
        </MakeRoomNameBox>
        <MakeRoomOptionBox>
          <SelectBox>
            <p className="boldText">운동 난이도</p>
            <div style={{ display: "flex" }}>
              {difficultyList.map((e, i) => (
                <DB_EL
                  key={i}
                  onClick={() => {
                    setClickedDifficulty(i);
                  }}
                  style={{
                    color: clickedDifficulty === i ? "#FFF" : "",
                    background: clickedDifficulty === i ? "#667EFC" : "",
                    fontWeight: clickedDifficulty === i ? "600" : "",
                  }}
                >
                  {e}
                </DB_EL>
              ))}
            </div>
          </SelectBox>
          <CategoryBox>
            <p className="boldText" style={{ margin: "14px 0px" }}>
              카테고리
            </p>
            <Dropdown
              dropdownList={categoryList}
              getCategory={getCategory}
              background="#D9DFFE"
              fontcolor="#878E95"
              width="276px"
            >
              운동 카테고리를 골라주세요
            </Dropdown>
          </CategoryBox>
        </MakeRoomOptionBox>
        <LinkInputBox>
          <p className="boldText">운동 영상 링크</p>
          <LinkInput
            type="text"
            placeholder="함께 보고 운동할 영상의 링크를 입력해주세요"
            ref={$LinkInput}
          />
        </LinkInputBox>
        <SettingContainer>
          <SelectBox style={{ width: "60%" }}>
            <p className="boldText">시작 시간 설정</p>
            <div style={{ display: "flex" }}>
              {startTimeList.map((e, i) => (
                <DB_EL
                  key={i}
                  onClick={() => {
                    setClickedStartTime(i);
                  }}
                  style={{
                    padding: "8px 14px",
                    margin: "14px 15px 0 0",
                    color: clickedStartTime === i ? "#FFF" : "",
                    background: clickedStartTime === i ? "#667EFC" : "",
                    fontWeight: clickedStartTime === i ? "600" : "",
                  }}
                >
                  {e}
                </DB_EL>
              ))}
            </div>
          </SelectBox>
          <PwInputBox>
            <p
              className="boldText"
              style={{ display: "flex", alignItems: "center", height: "21px" }}
            >
              비밀방 여부
              {isSecret ? (
                <img
                  src={checkBox}
                  alt="체크"
                  className="scaleHalf"
                  onClick={checkSecret}
                  style={{ webkitUserDrag: "none" }}
                ></img>
              ) : (
                <img
                  src={noneCheckBox}
                  alt="미체크"
                  className="scaleHalf"
                  onClick={checkSecret}
                  style={{ webkitUserDrag: "none" }}
                ></img>
              )}
            </p>

            <PwInput
              type="password"
              placeholder="비밀번호 설정"
              ref={$pwInput}
              maxLength={8}
              onKeyDown={pwOnkeydown}
              pwInputWrong={pwInputWrong}
            />
            <PwMessage ref={$postMessage} pwInputWrong={pwInputWrong}>
              비밀번호는 숫자 4~8자 사이로 입력해주세요
            </PwMessage>
          </PwInputBox>
        </SettingContainer>
        <BtnBox>
          <CancelBtn
            onClick={() => {
              setIsMakeModal(false);
              // document.body.style.overflow = 'unset';
            }}
          >
            취소하기
          </CancelBtn>
          <MakeBtn
            onClick={() => {
              clickMakeBtn();
            }}
          >
            만들기
          </MakeBtn>
        </BtnBox>
      </MakeRoomContainer>
    </Background>
  );
};

const Background = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MakeRoomContainer = styled.div`
  width: 668px;
  height: 760px;
  background: #ffffff;
  border-radius: 12px;
  padding: 48px;
  font-size: 18px;
  color: #878e95;
  z-index: 100;
  .boldText {
    font-weight: 700;
    color: #000000;
  }
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1360px) {
    transform: scale(0.8);
  }

  .scaleHalf {
    transform: scale(0.5);
  }
`;
const MakeRoomHeader = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f3f5;
  padding-bottom: 32px;
  display: flex;
`;

const MakeRoomNameBox = styled.div``;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
`;
const RoomNameInput = styled.textarea`
  width: 572px;
  height: 72px;
  border-radius: 8px;
  background-color: #f1f3f5;
  padding: 12px;
  resize: none;
  border: none;
  // outline:none;
  &::placeholder {
    color: #878e95;
    font-size: 16px;
  }
  font-size: 18px;
  outline: none;
`;

const MakeRoomOptionBox = styled.div`
  display: flex;
  align-items: center;
  height: 102px;
`;
const SelectBox = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 32px;
  width: 60%;
`;
const DB_EL = styled.div`
  margin: 14px 20px 0 0;
  padding: 0px 20px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: #eaecef;
  color: #878e95;
  cursor: pointer;
`;
const CategoryBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-direction: column;
`;

const LinkInputBox = styled.div`
  margin-top: 32px;
`;

const LinkInput = styled.input`
  width: 572px;
  height: 48px;
  border-radius: 8px;
  background-color: #f1f3f5;
  padding: 12px;
  resize: none;
  border: none;
  // outline: none;
  &::placeholder {
    color: #878e95;
    font-size: 16px;
  }
  margin-top: 14px;
  font-size: 18px;
  outline: none;
`;

const BtnBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  justify-content: space-between;
  margin-top: 24px;
`;
const CancelBtn = styled.div`
  width: 165px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: solid 1px #aeb5bc;
  background-color: #fff;
  cursor: pointer;
`;
const MakeBtn = styled.div`
  width: 392px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: #0028fa;
  font-weight: bold;
  color: white;
  cursor: pointer;
`;

const SettingContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

const PwInputBox = styled.div`
  margin-top: 32px;
  width: 50%;
`;

const PwInput = styled.input`
  width: 276px;
  height: 40px;
  border-radius: 8px;
  background-color: #f1f3f5;
  padding: 12px;
  resize: none;
  border: none;
  // outline: none;
  &::placeholder {
    color: #878e95;
    font-size: 16px;
  }
  margin-top: 14px;
  font-size: 18px;
  visibility: hidden;
  // .pwInputWrong {
  //   border: 1px #f7444e solid;
  // }
  &:focus {
    ${(props) => (props.pwInputWrong ? `outline:1px #f7444e solid;` : "")}
  }
`;

const PwMessage = styled.div`
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: -0.48px;
  margin: 4px 0px 0px 2px;
  visibility: hidden;
  .pwInputWrong {
    color: #f7444e;
  }
  ${(props) => (props.pwInputWrong ? `color: #f7444e;` : "")}
`;

export default MakeRoomModal;
