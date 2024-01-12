import React from 'react';
import gosling from 'gosling.js';
import { AltGoslingComponent } from '../src/AltGoslingComponent';

import { barChart } from './examples/barChart';

function Demo() {
    const goslingSpec = barChart as gosling.GoslingSpec;
    return (
        <>
            <AltGoslingComponent spec={goslingSpec}/>
       </>
   );
}

export default Demo;