import React, {useEffect, useState} from 'react';
import {Header} from "../Header";
import {CalendarGrid} from "../CalendarGrid";
import {Monitor} from "../Monitor";
import moment from "moment";
import styled from "styled-components";
import AppSchedule from "../../components/appSchedule/script";
import {useNavigate} from "react-router-dom";
import {DISPLAY_MODE_DAY, DISPLAY_MODE_MONTH} from "../helpers/constants";
import {DayShowComponent} from "../DayShowComponent";
import localStorage from "mobx-localstorage";
import {
    ButEx,
    Button1Wrapper, EventBody,
    FormPositionWrapper,
    FormWrapper, HoursButton,
    ListOfHours,
    ShadowWrapper
} from "../containers/StyledComponents";

export const ButtonsWrapper = styled('div')`
  padding: 8px 14px;
  display: flex;
  background-color: #FFFFFF;
  justify-content: flex-end;
`;

export const ButtonWrapper = styled('button')`
  color: ${props => props.danger ? '#f00' : '#272282A'};
  border: 1px solid ${props => props.danger ? '#f00' : '#27282A'};
  border-radius: 2px;
  cursor: pointer;
  &:not(:last-child){
    margin-right: 2px;
  }
`;
const url = 'http://localhost:3001';
const totalDays = 42;
const defaultEvent = {
    title: '',
    description: '',
    login: localStorage.getItem("login"),
    date: moment().format('X'),
    exercise: "Exercise"

}


function Schedule() {
    const [displayMode, setDisplayMode] = useState(DISPLAY_MODE_MONTH);
    const navigate = useNavigate();
    moment.updateLocale('en', {week: {dow: 1}})
    // const today = moment();
    const [today, setToday] = useState(moment())
    const startDay = today.clone().startOf(DISPLAY_MODE_MONTH).startOf('week');
    const prevHandler = () => {
        setToday(prev => prev.clone().subtract(1, displayMode))
    };
    const todayHandler = () => setToday(moment())
    const nextHandler = () => {
        setToday(prev => prev.clone().add(1, displayMode))
    };

    const [method, setMethod] = useState(null)
    const [isShowForm, setShowForm] = useState(false)
    const [event, setEvent] = useState(null);//event for redaction
    const [events, setEvents] = useState([]);
    const startDateQuery = startDay.clone().format('X');
    const endDateQuery = today.clone().add(totalDays, 'days').format('X');
    const currLogin = localStorage.getItem('login');
    useEffect(() => {
        fetch(`${url}/events?date_gte=${startDateQuery}&date_lte=${endDateQuery}&login=${currLogin}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setEvents(res);
            })
    }, [today])
    const openFormHandler = (methodName, eventForUpdate, dayItem) => {
        setEvent(eventForUpdate || {...defaultEvent, date: dayItem.format('X')});
        setMethod(methodName);
    }
    const openModalFormHandler = (methodName, eventForUpdate, dayItem) => {
        setShowForm(true);
        openFormHandler(methodName, eventForUpdate, dayItem);
    }
    const cancelButtonHandler = () => {
        setShowForm(false);
        setEvent(null);
    }
    const changeEventHandler = (text, field) => {
        setEvent(prevState => ({
            ...prevState,
            [field]: text
        }))
    }
    const removeEventHandler = () => {
        const fetchUrl = `${url}/events/${event.id}`;
        const httpMethod = 'DELETE';

        fetch(fetchUrl, {
                method: httpMethod,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(res => res.json())
            .then(res => {
                setEvents(prevState => prevState.filter(eventEl => eventEl.id !== event.id))
                cancelButtonHandler()
            })

    }
    const eventFetchHandler = () => {
        const fetchUrl = method === 'Update' ? `${url}/events/${event.id}` : `${url}/events`;
        const httpMethod = method === 'Update' ? 'PATCH' : 'POST';

        fetch(fetchUrl, {
                method: httpMethod,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            }
        )
            .then(res => res.json())
            .then(res => {
                if (httpMethod === 'PATCH') {
                    setEvents(prevState => prevState.map(eventEl => eventEl.id === res.id ? res : eventEl))
                } else {
                    setEvents(prevState => [...prevState, res]);
                }
                cancelButtonHandler()
            })

    }
    const [exercisesPicker, setExercisesPicker] = useState(false);
    const array1 = ["press", "running", "planka", "otjimanie"];
    const addExercise = (i) => {
        setExercisesPicker(false);
        changeEventHandler(i, 'exercise');
    }
    return (
        <>
            {
                isShowForm ? (
                    <FormPositionWrapper onClick={cancelButtonHandler}>
                        <FormWrapper onClick={e => e.stopPropagation()}>
                            <ButEx>
                                <Button1Wrapper
                                    onClick={() => setExercisesPicker(prevState => !prevState)}>{`${event.exercise}`}</Button1Wrapper>
                                {
                                    exercisesPicker ? (
                                        <ListOfHours>{
                                            [...new Array(array1.length)].map((_, i) => (
                                                <li>
                                                    <HoursButton
                                                        onClick={() => addExercise(array1.at(i))}>{array1.at(i)}</HoursButton>
                                                </li>
                                            ))
                                        }</ListOfHours>
                                    ) : null}
                            </ButEx>
                            <EventBody
                                value={event.description}
                                onChange={e => changeEventHandler(e.target.value, 'description')}
                                placeholder="Description"
                            />
                            <ButtonsWrapper>
                                <Button1Wrapper onClick={cancelButtonHandler}>Cancel</Button1Wrapper>
                                <Button1Wrapper onClick={eventFetchHandler}>{method}</Button1Wrapper>
                                {
                                    method === 'Update' ? (
                                        <ButtonWrapper danger onClick={removeEventHandler}>Remove</ButtonWrapper>
                                    ) : null
                                }
                            </ButtonsWrapper>
                        </FormWrapper>
                    </FormPositionWrapper>
                ) : null
            }
            <AppSchedule>
                <ShadowWrapper>
                    <Header/>
                    <Monitor today={today}
                             prevHandler={prevHandler}
                             todayHandler={todayHandler}
                             nextHandler={nextHandler}
                             setDisplayMode={setDisplayMode}
                             displayMode={displayMode}
                    />
                    {
                        displayMode === DISPLAY_MODE_MONTH ? (
                            <CalendarGrid startDay={startDay} today={today} totalDays={totalDays} events={events}
                                          openFormHandler={openModalFormHandler} setDisplayMode={setDisplayMode}/>
                        ) : null
                    }
                    {
                        displayMode === DISPLAY_MODE_DAY ? (
                            <DayShowComponent events={events} today={today} selectedEvent={event}
                                              changeEventHandler={changeEventHandler}
                                              cancelButtonHandler={cancelButtonHandler}
                                              eventFetchHandler={eventFetchHandler}
                                              method={method}
                                              removeEventHandler={removeEventHandler}
                                              openFormHandler={openFormHandler}/>
                        ) : null
                    }
                </ShadowWrapper>
            </AppSchedule>
        </>
    )
}

export default Schedule;
