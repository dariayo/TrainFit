import React from "react";
import styled from "styled-components";
import {DISPLAY_MODE_DAY, DISPLAY_MODE_MONTH} from "../helpers/constants";

const DivWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  background-color: #FFFFFF;
  border-bottom: 2px solid #E5E5E5;
  color: #1E1F21;
  padding: 16px;
  position: relative;
`
const TextWrapper = styled('span')`
  font-size: 32px;
`;
const TitleWrapper = styled(TextWrapper)`
  font-weight: bold;
  margin-right: 8px;
  margin-left: 8px;
`;
const ButtonsWrapper = styled('div')`
  display: flex;
  align-items: center;
`;
const ButtonsCenterWrapper = styled(ButtonsWrapper)`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%,-50%);
`;

const ButtonWrapper = styled('button')`
  border: unset;
  background-color: #FFFFFF;
  border: 1px solid #565759;
  height: 30px;
  border-radius: 4px;
  cursor:pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TodayButton = styled(ButtonWrapper)`
	font-weight: bold;
`;
const Monitor = ({today, prevHandler, todayHandler, nextHandler, setDisplayMode, displayMode}) => {
    return (
        <DivWrapper>
            <div>
                {
                    displayMode === DISPLAY_MODE_DAY ? (
                        <TextWrapper>
                            {today.format("DD")}
                        </TextWrapper>
                    ) : null
                }
                <TitleWrapper>
                    {today.format("MMMM")}
                </TitleWrapper>
                <TextWrapper>
                    {today.format("YYYY")}
                </TextWrapper>
            </div>
            <ButtonsCenterWrapper>
                <ButtonsWrapper unPressed={displayMode === DISPLAY_MODE_MONTH} onClick={() => setDisplayMode(DISPLAY_MODE_MONTH)}>Month</ButtonsWrapper>
                <ButtonWrapper unPressed={displayMode === DISPLAY_MODE_DAY} onClick={() => setDisplayMode(DISPLAY_MODE_DAY)}>Day</ButtonWrapper>
            </ButtonsCenterWrapper>
            <ButtonsWrapper>
                <ButtonWrapper onClick={prevHandler}> &lt; </ButtonWrapper>
                <TodayButton onClick={todayHandler}>Today</TodayButton>
                <ButtonWrapper onClick={nextHandler}> &gt; </ButtonWrapper>
            </ButtonsWrapper>

        </DivWrapper>
    )
}
export {Monitor}
