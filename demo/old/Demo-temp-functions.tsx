import React, { useEffect, useRef, useState } from 'react';
import gosling, { GoslingComponent, GoslingSpec } from 'gosling.js';
import { AltTrackSingle } from '../src/schema/alt-gosling-schema';
import { getAlt } from '../src/alt-gosling-model' 
import { renderAltTree } from '../src/render';
import { altUpdateSpecWithData } from '../src/alt-gosling-model/alt-data/alt-from-data';
import { barProcessed } from './examples/bar-processed';
import { barData } from './examples/bar-data';

function Demo() {

    const specProcessed = getAlt(barProcessed as GoslingSpec);
    const uid = (specProcessed.tracks[0] as AltTrackSingle).uid
    const specTreeNew = altUpdateSpecWithData(specProcessed, uid, barData);
    const specTree = renderAltTree(specTreeNew);


    useEffect(() => {
        console.log('bar processed', barProcessed);
        console.log('spec processed', specProcessed);    
    })
    

    return (
        <>
            {specTree}
        </>
    )
}

export default Demo;