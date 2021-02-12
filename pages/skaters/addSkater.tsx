import React, { useState } from 'react';

const addSkater = (() => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = ((event:React.FormEvent) => {
        console.log('Pretend save Skater["name": "{name}","email":"{email}"');
    });

    return <>
        <form onSubmit={((e) => {handleSubmit(e)})} >
            <label>
                Name :
                <input type="text" value={name} onChange={((e) => {setName(e.target.value)})} />
            </label>
            <label>
                Email:
                <input type="text" value={email} onChange={((e) => {setEmail(e.target.value)})} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    </>;
});

export default addSkater;