import React, { useEffect, useState } from 'react'
import axios from 'axios';
import styled from 'styled-components';

const BigDiv = styled.div`
    display: grid;
    size: 100%;
`;

const Div = styled.div`
    place-self: center;
`;

const Name = styled.p`
    text-align: left;
    margin-bottom: 0px;
    font-size: small;
`;

const In = styled.input`
    background-color: #D9D9D9;
    border: none;
    border-bottom: black 1.5px solid;
    max-height: fit-content;
    min-height: 30px;
    padding: 2%;
    margin-top: 0px;
    border-radius: 0px;
`;

const Input = (props) => {
    return (
        <BigDiv>
            <Div>
                <Name>{props.title}</Name>
                <In
                    required
                    name={props.name}
                    type={props.type}
                    minLength={props.minLength}
                    value={props.value}
                    onChange={props.onChange}
                />
            </Div>
        </BigDiv>
    )
}

export default Input;