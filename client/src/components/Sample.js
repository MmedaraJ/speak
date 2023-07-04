import React, { useEffect, useState } from 'react'
import axios from 'axios';
import styled from 'styled-components';
import { ReactComponent as Play} from '../images/play.svg';
import { ReactComponent as Download} from '../images/download.svg';
import { ReactComponent as Delete} from '../images/delete.svg';

const UploadDiv = styled.div`
    background-color: #D9D9D9;
    border: none;
    border-bottom: black 1.5px solid;
    height: fit-content;
    width: max;
    padding: 2%;
    margin-top: 0px;
    margin-bottom: 2%;
    border-radius: 0px;
    display: flex;
    @media (max-width: 768px) {
        display: block;
        padding: 4%;
    }
    @media (max-width: 600px) {
        padding: 2%;
    }
`;

const UploadName = styled.div`
    flex: 3;
    width: max;
    @media (max-width: 768px) {
        display: block;
    }
`;

const UploadIcons = styled.div`
    flex: 1;
    width: max;
    text-align: right;
    @media (max-width: 768px) {
        display: block;
        margin-top: 4%;
        text-align: left;
    }
`;

const P = styled.p`
    margin: 0;
`;

const ImageSpan = styled.span`
    width: 8px;
    height: 8px;
    vertical-align: middle;
    margin-left: 15%;
    //margin-right: 5%;
    @media (max-width: 768px) {
        margin-left: 0;
        margin-right: 10%;
    }
`;

const Sample = (props) => {
    return (
        <UploadDiv key={props.theKey}>
            <UploadName>
                <P>{props.uploadName}</P>
            </UploadName>
            <UploadIcons>
                <ImageSpan>
                    <Play/>
                </ImageSpan>
                <ImageSpan>
                    <Download/>
                </ImageSpan>
                <ImageSpan>
                    <Delete/>
                </ImageSpan>
            </UploadIcons>
        </UploadDiv>
    )
}

export default Sample;