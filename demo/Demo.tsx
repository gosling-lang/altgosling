import React from 'react';
import gosling from 'gosling.js';
import { AltGoslingComponent } from '../src/AltGoslingComponent';

import { bar } from './examples/bar';

function Demo() {
    const goslingSpec = bar as gosling.GoslingSpec;
    return (
        <>
            <AltGoslingComponent spec={goslingSpec}/>
       </>
   );
}

export default Demo;