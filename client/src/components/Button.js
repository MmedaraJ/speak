import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import {ReactComponent as Icon} from '../images/ellipse-1.svg';
import {ReactComponent as IconBlack} from '../images/ellipse-black.svg';

const Button = styled.button`
    background-color: ${props => props.backgroundColor};
    color:  ${props => props.color};
    border-radius: 23.5px;
    width: ${props => props.width};
    padding: 8px;
    border: none;
    font-size: small;
    vertical-align: middle;
    text-align: center;
`;

const ImageSpan = styled.span`
    width: 8px;
    height: 8px;
    vertical-align: middle;
`;

const MyButton = (props) => {
    Button.defaultProps = {
        backgroundColor: props.backgroundColor,
        color: props.color,
        width: props.width
    }

    return (
        <Button
            type={props.type}
            onClick={props.onClick}
        >
            {props.text} &nbsp;
            <ImageSpan>
            {
                props.text === 'Login'?
                <Icon/>:
                <IconBlack/>
            }
            </ImageSpan>
        </Button>
    )
}

export default MyButton;