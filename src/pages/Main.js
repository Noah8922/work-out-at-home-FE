import React from "react";
// import { Button, Grid, Input, Text } from "../elements";
import styled from "styled-components";
import Card from "../components/Card";
// import { FaHeart } from "react-icons/fa";
// import Post from "../components/Post";
// import { useDispatch, useSelector } from "react-redux";
// import { actionCreators as PostActions } from "../redux/modules/post";
// import { actionCreators as CommonActions } from "../redux/modules/common";

const Main = () => {
  //   const dispatch = useDispatch();
  //   const postList = useSelector((state) => state.post.list);
  //   React.useEffect(() => {
  //     dispatch(PostActions.getPostDB());
  //   }, []);

  return (
    <>
      <Container>
        <Card></Card>
      </Container>
    </>
  );
};
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #e5e5e5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Main;
