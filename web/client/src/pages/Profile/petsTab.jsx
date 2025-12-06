import { useState } from 'react';

import PetForm from './petForm'

const PetsTab = () => {
    const [activeForm, setActiveForm] = useState('edit');

    return (
        <>
        <div className="w-1/4 min-h-[inherit] flex flex-col items-center justify-around">
            <input placeholder="Find your pets..." className="w-9/10 h-1/10 border-blue-400 border-4 rounded-lg pl-4"></input>
            <ul className="w-9/10 h-8/10 border-blue-400 border-4 rounded-lg pl-4"></ul>
        </div>
        <div className="w-1 min-h-[inherit] bg-blue-950 mx-4"></div>
        <div className="w-3/4 min-h-[inherit] flex flex-col items-center">
            <div className="h-[100px] w-full flex justify-around items-center">
                <button onClick={() => {setActiveForm('edit')}} className="w-2/5 h-8/10 bg-blue-400 border-4 rounded-lg">Edit a Pet's Info</button>
                <button onClick={() => {setActiveForm('add')}} className="w-2/5 h-8/10 bg-blue-400 border-4 rounded-lg">Add a Pet</button>
            </div>
            <PetForm activeForm={activeForm}/>
        </div>
        </>
    );
}

export default PetsTab;