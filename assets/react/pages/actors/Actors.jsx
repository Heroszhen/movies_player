import { useState, useEffect } from 'react';

const Actors = (props) => {
    const [actorIndex, setActorIndex] = useState(null);

    return (
        <>
            <section id="sectors">
                <section id="list-actors" className={actorIndex === null ? '' : 'd-none'}>

                </section>
                <section id="list-actors" className={actorIndex === null ? 'd-none' : ''}>

                </section>
            </section>
        </>
    );
}
export default Actors;