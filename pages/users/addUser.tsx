import { AxiosInstance } from 'axios';
import React, { useState } from 'react';
import styles from './userList.module.css';
import { Card, User } from './users';

interface AddPayload {
    name: string;
    email: string;
}

interface AddUserProps {
    instance: AxiosInstance;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setAddingUser: React.Dispatch<React.SetStateAction<boolean>>;
    addingUser: boolean;
    card: Card;
    cards: JSX.Element[];
    setCards: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}

const AddUser = ((props: AddUserProps):JSX.Element => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const onAdd = (async(e: React.FormEvent, payload: AddPayload) => {
        e.preventDefault();
        console.log(`Adding user with payload ${payload}`);
        await props.instance.post('/addUser', payload)
        .then((response) => {
            console.log(response);
            props.setUsers([...props.users, response.data as User]);
            setName("");
            setEmail("");
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            props.setCards(props.cards.filter((card: JSX.Element) => {
                return card.
            }))
        })
    });
    return <div id={`${props.card.name}_${props.card.instance}`} className={styles.flexContainerSubsequentChild}>
        <form onSubmit={(e) => {
            onAdd(e, {name: name, email: email} as AddPayload);
        }}>
            <h3>Add User</h3>
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
    </div>;
});

export default AddUser;
export type { AddUserProps };