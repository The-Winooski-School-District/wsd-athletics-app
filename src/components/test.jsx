import React from 'react'
import Calendar from 'react-calendar';

const test = () =>{
    const [value, onChange] = [];

    return (
      <div>
        <Calendar onChange={onChange} value={value} />
      </div>
    );
}

export default test